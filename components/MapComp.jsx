"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useDiagnosisResponse } from "@/lib/diagnosisResponse";
import { deriveSpecialtySearch } from "@/lib/specialityHospitals";

const statusLabel = {
  idle: "Ready",
  loading: "Searching...",
  ready: "Live updates",
  empty: "No matches yet",
  error: "Search unavailable",
};

const DEFAULT_RADIUS_METERS = 7000;
const DEFAULT_MAP_SETTINGS = {
  keyword: "",
  placeType: "hospital",
  title: "Nearby care",
  highlight: "Tap a marker or list item to see contact details.",
};

const MapComponent = ({
  keyword,
  placeType,
  radius = DEFAULT_RADIUS_METERS,
  title,
  highlight,
  limit = 6,
  useDiagnosisFallback = true,
}) => {
  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const latestDiagnosis = useDiagnosisResponse();
  const analysis = latestDiagnosis?.analysis;
  const conditions = Array.isArray(analysis?.conditions)
    ? analysis.conditions
    : [];
  const specialtyHint = analysis?.whichSpecialityHospitalToGo ?? "";

  const derivedSpecialty = useMemo(() => {
    if (!useDiagnosisFallback) return null;
    if (!conditions.length && !specialtyHint) return null;
    return deriveSpecialtySearch(conditions, specialtyHint);
  }, [conditions, specialtyHint, useDiagnosisFallback]);

  const mergedSettings = useMemo(() => {
    if (keyword || placeType || title || highlight) {
      return {
        keyword: keyword ?? DEFAULT_MAP_SETTINGS.keyword,
        placeType: placeType ?? DEFAULT_MAP_SETTINGS.placeType,
        title: title ?? DEFAULT_MAP_SETTINGS.title,
        highlight: highlight ?? DEFAULT_MAP_SETTINGS.highlight,
      };
    }

    if (derivedSpecialty) {
      return {
        keyword: derivedSpecialty.keyword ?? DEFAULT_MAP_SETTINGS.keyword,
        placeType: derivedSpecialty.placeType ?? DEFAULT_MAP_SETTINGS.placeType,
        title: derivedSpecialty.title ?? DEFAULT_MAP_SETTINGS.title,
        highlight: derivedSpecialty.highlight ?? DEFAULT_MAP_SETTINGS.highlight,
      };
    }

    return DEFAULT_MAP_SETTINGS;
  }, [derivedSpecialty, highlight, keyword, placeType, title]);

  const searchKeyword = mergedSettings.keyword;
  const searchPlaceType = mergedSettings.placeType;
  const panelTitle = mergedSettings.title;
  const panelHighlight = mergedSettings.highlight;

  const mapRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [activePlaceId, setActivePlaceId] = useState(null);
  const fetchIdRef = useRef(0);

  const options = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      zoomControl: true,
    }),
    []
  );

  const fetchNearbyHospitals = useCallback(
    (map, position) => {
      if (!google?.maps?.places) {
        console.warn("Places library not yet loaded.");
        return;
      }

      const currentFetchId = fetchIdRef.current + 1;
      fetchIdRef.current = currentFetchId;
      setStatus("loading");
      setError("");
      setHospitals([]);
      setActivePlaceId(null);

      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: position,
        radius,
      };

      if (searchKeyword) request.keyword = searchKeyword;
      if (searchPlaceType) request.type = searchPlaceType;

      service.nearbySearch(request, (results, serviceStatus) => {
        if (currentFetchId !== fetchIdRef.current) {
          return;
        }
        if (
          serviceStatus === google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          const basicResults = results.slice(0, limit).map((r) => ({
            id: r.place_id,
            name: r.name,
            position: {
              lat: r.geometry.location.lat(),
              lng: r.geometry.location.lng(),
            },
            address: r.vicinity ?? "",
            rating: typeof r.rating === "number" ? r.rating : null,
            totalRatings:
              typeof r.user_ratings_total === "number"
                ? r.user_ratings_total
                : null,
          }));

          const fetchDetails = (placeId) =>
            new Promise((resolve) => {
              service.getDetails(
                {
                  placeId,
                  fields: [
                    "formatted_phone_number",
                    "international_phone_number",
                    "website",
                    "opening_hours",
                    "formatted_address",
                    "geometry",
                  ],
                },
                (detail, detailStatus) => {
                  if (
                    detailStatus ===
                      google.maps.places.PlacesServiceStatus.OK &&
                    detail
                  ) {
                    resolve(detail);
                  } else {
                    resolve(null);
                  }
                }
              );
            });

          Promise.all(
            basicResults.map(async (place) => {
              const detail = await fetchDetails(place.id);
              if (!detail) return place;

              const openingHours =
                detail.opening_hours?.weekday_text ?? undefined;
              const isOpen =
                typeof detail.opening_hours?.isOpen === "function"
                  ? detail.opening_hours.isOpen()
                  : undefined;
              const formattedAddress =
                detail.formatted_address || place.address;

              return {
                ...place,
                address: formattedAddress,
                phone:
                  detail.formatted_phone_number ||
                  detail.international_phone_number ||
                  "",
                website: detail.website || "",
                openingHours,
                isOpen,
                position: detail.geometry?.location
                  ? {
                      lat: detail.geometry.location.lat(),
                      lng: detail.geometry.location.lng(),
                    }
                  : place.position,
              };
            })
          )
            .then((enriched) => {
              if (currentFetchId !== fetchIdRef.current) return;
              setHospitals(enriched);
              setStatus(enriched.length ? "ready" : "empty");
            })
            .catch((detailsError) => {
              console.error("Failed to fetch place details:", detailsError);
              if (currentFetchId !== fetchIdRef.current) return;
              setHospitals(basicResults);
              setStatus(basicResults.length ? "ready" : "empty");
            });
        } else if (
          serviceStatus === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          setHospitals([]);
          setStatus("empty");
        } else {
          console.warn("Places search failed:", serviceStatus);
          setHospitals([]);
          setStatus("error");
          setError("We couldn’t find matching locations right now.");
        }
      });
    },
    [limit, radius, searchKeyword, searchPlaceType]
  );

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      if (currentPosition) fetchNearbyHospitals(map, currentPosition);
    },
    [currentPosition, fetchNearbyHospitals]
  );

  useEffect(() => {
    if (mapRef.current && currentPosition) {
      fetchNearbyHospitals(mapRef.current, currentPosition);
    }
  }, [currentPosition, fetchNearbyHospitals]);

  useEffect(() => {
    let cancelled = false;

    const fallbackToIp = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Failed to resolve IP location.");
        const data = await res.json();
        if (!cancelled) {
          setCurrentPosition({ lat: data.latitude, lng: data.longitude });
        }
      } catch (err) {
        console.error("Error fetching IP location:", err);
        if (!cancelled) setError("Unable to determine your location.");
      }
    };

    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.warn("Geolocation not available:", err);
          fallbackToIp();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      fallbackToIp();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLoaded) {
    return <div className="text-muted">Loading map...</div>;
  }

  if (!currentPosition) {
    return <div className="text-muted">Determining your location…</div>;
  }

  return (
    <section className="space-y-6">
      <div className="glass-card overflow-hidden rounded-3xl p-1">
        <GoogleMap
          zoom={13}
          center={currentPosition}
          mapContainerStyle={{
            width: "100%",
            height: "420px",
            borderRadius: "24px",
          }}
          options={options}
          onLoad={onLoad}
        >
          {/* Your current position (blue dot) */}
          <Marker
            position={currentPosition}
            title="You are here"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#2563EB", // blue-600
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
            zIndex={9999}
          />

          {/* Other locations (emerald triangles) */}
          {hospitals.map((h) => (
            <Marker
              key={h.id}
              position={h.position}
              title={h.name}
              onClick={() => setActivePlaceId(h.id)}
            />
          ))}

          {activePlaceId && (
            <InfoWindow
              position={
                hospitals.find((h) => h.id === activePlaceId)?.position ||
                currentPosition
              }
              onCloseClick={() => setActivePlaceId(null)}
            >
              <div className="space-y-1 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">
                  {hospitals.find((h) => h.id === activePlaceId)?.name ??
                    "Care location"}
                </p>
                <p>
                  {hospitals.find((h) => h.id === activePlaceId)?.address ??
                    "Address unavailable"}
                </p>
                {hospitals.find((h) => h.id === activePlaceId)?.phone && (
                  <p>
                    Phone:{" "}
                    {hospitals.find((h) => h.id === activePlaceId)?.phone}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{panelTitle}</h3>
            {panelHighlight && (
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {panelHighlight}
              </p>
            )}
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            {statusLabel[status]}
          </span>
        </div>

        {status === "error" && error && (
          <p className="mt-4 text-sm text-rose-200">{error}</p>
        )}

        {status === "empty" && (
          <p className="mt-4 text-sm text-muted">
            We couldn’t find specialists matching this search nearby. Try
            broadening the condition or check again soon.
          </p>
        )}

        {hospitals.length > 0 && (
          <ul className="mt-4 space-y-3">
            {hospitals.map((hospital) => (
              <li
                key={hospital.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold text-white">
                    {hospital.name}
                  </p>
                  {typeof hospital.rating === "number" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                      ★ {hospital.rating.toFixed(1)}
                      {hospital.totalRatings
                        ? ` (${hospital.totalRatings})`
                        : ""}
                    </span>
                  )}
                </div>
                {hospital.address && (
                  <p className="text-xs text-muted">{hospital.address}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                  {typeof hospital.isOpen === "boolean" && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${
                        hospital.isOpen
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-rose-500/10 text-rose-200"
                      }`}
                    >
                      {hospital.isOpen ? "Open now" : "Closed"}
                    </span>
                  )}
                  {hospital.phone && <span>Phone: {hospital.phone}</span>}
                  {hospital.website && (
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-200 hover:text-emerald-100"
                    >
                      Website
                    </a>
                  )}
                </div>
                {!!hospital.openingHours?.length && (
                  <details className="group rounded-2xl bg-white/5 p-3 text-xs text-muted">
                    <summary className="cursor-pointer text-white group-open:text-muted">
                      View weekly hours
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {hospital.openingHours.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MapComponent;
