import React, { useState } from "react";

export default function PhoneInputBox({ value, onChange }) {
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, ""); // only digits
    setPhone(onlyNums);
    onChange(countryCode + onlyNums); // send full number back
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%", // take full width of parent
        gap: "5px", // small gap between
      }}
    >
      {/* Country Code Dropdown (20%) */}
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        style={{
          flex: "0 0 30%", // fixed 30% width
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      >
        <option value="+91">+91 (In)</option>
        <option value="+1">+1 (USA)</option>
        <option value="+44">+44 (UK)</option>
        <option value="+61">+61 (Aus)</option>
      </select>

      {/* Phone Input (70%) */}
      <input
        type="tel"
        placeholder="Phone Number"
        maxLength={10}
        value={phone}
        onChange={handlePhoneChange}
        style={{
          flex: "0 0 70%", // fixed 80% width
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        required
      />
    </div>
  );
}