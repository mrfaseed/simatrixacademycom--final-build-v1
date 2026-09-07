import { useEffect, useState } from "react";
import { api } from "../api/client";

let cache = null;

export function loadSettings() {
  if (!cache) {
    cache = api
      .getSite()
      .then((r) => {
        const s = r.data?.settings || {};
        return {
          ...s,
          contact_phone: "+91 93637 93954",
          contact_phone2: "+91 93637 93954",
          contact_address: "1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001",
          whatsapp: "919363793954",
        };
      })
      .catch(() => ({
        contact_phone: "+91 93637 93954",
        contact_phone2: "+91 93637 93954",
        contact_address: "1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001",
        whatsapp: "919363793954",
      }));
  }
  return cache;
}

export function useSettings() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    let alive = true;
    loadSettings().then((s) => alive && setSettings(s));
    return () => {
      alive = false;
    };
  }, []);
  return settings || {};
}
