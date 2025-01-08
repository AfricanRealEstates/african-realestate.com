"use client";
import React, { useEffect, useState } from "react";

export default function RegionSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");

  useEffect(() => {
    // Detect user language
    const userLanguage = navigator.language || navigator.language;
    setSelectedLanguage(userLanguage);

    // Detect user time zone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedTimezone(userTimezone);
  }, []);

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6">
      <h3 className="mb-4 text-2xl font-semibold">Language & Time</h3>
      <div className="mb-4">
        <label
          htmlFor="settings-language"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select language
        </label>
        <select
          id="settings-language"
          name="language"
          className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value={selectedLanguage}>{selectedLanguage}</option>
          {/* <option value="en-US">English (US)</option>
          <option value="it">Italiano</option>
          <option value="fr-FR">Français (France)</option>
          <option value="zh-TW">正體字</option>
          <option value="es-ES">Español (España)</option>
          <option value="de">Deutsch</option>
          <option value="pt-BR">Português (Brasil)</option> */}
        </select>
      </div>
      <div className="mb-6">
        <label
          htmlFor="settings-timezone"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Time Zone
        </label>
        <select
          id="settings-timezone"
          name="timezone"
          className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
        >
          <option value={selectedTimezone}>{selectedTimezone}</option>
          {/* <option value="GMT">GMT+0 Greenwich Mean Time (GMT)</option>
          <option value="CET">GMT+1 Central European Time (CET)</option>
          <option value="EET">GMT+2 Eastern European Time (EET)</option>
          <option value="Europe/Moscow">GMT+3 Moscow Time (MSK)</option>
          <option value="Asia/Karachi">
            GMT+5 Pakistan Standard Time (PKT)
          </option>
          <option value="Asia/Shanghai">GMT+8 China Standard Time (CST)</option>
          <option value="Australia/Sydney">
            GMT+10 Eastern Australia Standard Time (AEST)
          </option> */}
        </select>
      </div>
    </div>
  );
}
