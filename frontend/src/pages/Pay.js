import React, { useState } from "react";
import toast from "react-hot-toast";

const UPI_ID = "Q12720464@ybl";
const UPI_NAME = "Navbodh Organic & Healthy Products";

const PRODUCTS = [
  // { id: 1, name: 'Organic Mango Box',  emoji: '🥭', price: 499,  unit: 'box',   desc: 'Fresh seasonal mangoes, hand-picked' },
  {
    id: 2,
    name: "Pure Desi Ghee",
    emoji: "🧈",
    price: 1400,
    unit: "500ml",
    desc: "A2 bilona method, pure cow ghee",
  },
  {
    id: 3,
    name: "Banganapalli Mango",
    emoji: "🥭",
    price: 120,
    unit: "kg",
    desc: "Golden, juicy South Indian variety",
  },
  {
    id: 4,
    name: "Custom Amount",
    emoji: "💰",
    price: 0,
    unit: "",
    desc: "Enter your own amount",
  },
];

const Pay = () => {
  const [step, setStep] = useState("form"); // 'form' | 'pay'
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState(PRODUCTS[0]);
  const [custom, setCustom] = useState("");

  const amount = selected.id === 4 ? Number(custom) || 0 : selected.price * qty;

  const handleNext = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    if (!/^[6-9]\d{9}$/.test(phone))
      return toast.error("Enter a valid 10-digit mobile number");
    if (amount <= 0) return toast.error("Amount must be greater than 0");
    setStep("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openUPI = (app) => {
    const note = `${selected.name} - ${name}`;
    const base = `pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    const urls = {
      phonepe: `phonepe://pay?${base}`,
      gpay: `tez://upi/pay?${base}`,
      paytm: `paytmmp://pay?${base}`,
      bhim: `upi://pay?${base}`,
    };
    window.location.href = urls[app];
    // Fallback after 2s if app doesn't open
    setTimeout(() => {
      window.location.href = `upi://pay?${base}`;
    }, 2000);
  };

  const inp = {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #d8e8d4",
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    fontFamily: "Jost, sans-serif",
    background: "white",
    color: "#1e2b1f",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f1f11 0%, #1a2c1c 60%, #263d2a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "Jost, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 1, marginTop: 56 }}>🌿</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#e8d5b0",
              fontFamily: "Cormorant Garamond, serif",
              letterSpacing: "-0.3px",
            }}
          >
            Navbodh Organics
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              marginTop: 3,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Pure · Natural · Raipur
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* ── FORM STEP ── */}
          {step === "form" && (
            <form onSubmit={handleNext} style={{ padding: 28 }}>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 24,
                  color: "#1a2c1c",
                  marginBottom: 6,
                }}
              >
                Quick Payment
              </h2>
              <p style={{ fontSize: 13, color: "#6b7c6c", marginBottom: 24 }}>
                Fill in your details and pay instantly via UPI
              </p>

              {/* Product selection */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#3d4e3e",
                    marginBottom: 10,
                  }}
                >
                  Select Product
                </label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {PRODUCTS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelected(p);
                        setQty(1);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "2px solid",
                        borderColor:
                          selected.id === p.id ? "#3a5c3f" : "#d8e8d4",
                        background: selected.id === p.id ? "#eef5ef" : "white",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0 }}>
                        {p.emoji}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#1e2b1f",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7c6c",
                            marginTop: 1,
                          }}
                        >
                          {p.desc}
                        </div>
                      </div>
                      {p.price > 0 && (
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 15,
                            color: "#263d2a",
                            flexShrink: 0,
                          }}
                        >
                          ₹{p.price}/{p.unit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Qty or custom amount */}
              {selected.id === 4 ? (
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      color: "#3d4e3e",
                      marginBottom: 6,
                    }}
                  >
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    style={inp}
                    onFocus={(e) => (e.target.style.borderColor = "#3a5c3f")}
                    onBlur={(e) => (e.target.style.borderColor = "#d8e8d4")}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      color: "#3d4e3e",
                      marginBottom: 6,
                    }}
                  >
                    Quantity
                  </label>
                  <div
                    style={{
                      background: "#fff8e6",
                      border: "1px solid #f0d98a",
                      color: "#7a5a00",
                      padding: "10px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    📢 <strong>Notice:</strong> We only accept a minimum order
                    of <strong>2 kg</strong>. Mangoes are available only in{" "}
                    <strong>2 kg</strong> and <strong>4 kg</strong> boxes.
                  </div>
                  .
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        border: "1.5px solid #d8e8d4",
                        background: "white",
                        fontSize: 20,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3a5c3f",
                        fontWeight: 700,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#1e2b1f",
                        minWidth: 32,
                        textAlign: "center",
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        border: "1.5px solid #d8e8d4",
                        background: "white",
                        fontSize: 20,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3a5c3f",
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                    <span style={{ fontSize: 13, color: "#6b7c6c" }}>
                      {selected.unit}
                    </span>
                  </div>
                </div>
              )}

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#3d4e3e",
                    marginBottom: 6,
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#3a5c3f")}
                  onBlur={(e) => (e.target.style.borderColor = "#d8e8d4")}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "#3d4e3e",
                    marginBottom: 6,
                  }}
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "#3a5c3f")}
                  onBlur={(e) => (e.target.style.borderColor = "#d8e8d4")}
                />
              </div>

              {/* Amount preview */}
              {amount > 0 && (
                <div
                  style={{
                    background: "#eef5ef",
                    borderRadius: 14,
                    padding: "16px 20px",
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #d8e8d4",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#3d4e3e" }}
                  >
                    Total to Pay
                  </span>
                  <span
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#1a2c1c",
                    }}
                  >
                    ₹{amount}
                  </span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#1a2c1c",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Jost, sans-serif",
                }}
              >
                Proceed to Pay →
              </button>
            </form>
          )}

          {/* ── PAY STEP ── */}
          {step === "pay" && (
            <div style={{ padding: 28 }}>
              {/* Summary */}
              <div
                style={{
                  background: "#0f1f11",
                  borderRadius: 16,
                  padding: "20px 24px",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>
                  {selected.emoji}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#e8d5b0",
                    marginBottom: 4,
                  }}
                >
                  {selected.name}
                </div>
                {selected.id !== 4 && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 8,
                    }}
                  >
                    Qty: {qty} {selected.unit}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 48,
                    fontWeight: 800,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  ₹{amount}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 6,
                  }}
                >
                  For: {name} · {phone}
                </div>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: "#6b7c6c",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Choose your payment app
              </p>

              {/* UPI apps */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    id: "phonepe",
                    label: "Pay with PhonePe",
                    emoji: "💜",
                    bg: "#5f259f",
                    hover: "#4a1d7a",
                  },
                  {
                    id: "gpay",
                    label: "Pay with Google Pay",
                    emoji: "🔵",
                    bg: "#1a73e8",
                    hover: "#1557b0",
                  },
                  {
                    id: "paytm",
                    label: "Pay with Paytm",
                    emoji: "🔷",
                    bg: "#002970",
                    hover: "#001f54",
                  },
                  {
                    id: "bhim",
                    label: "Any UPI App",
                    emoji: "📱",
                    bg: "#3a5c3f",
                    hover: "#263d2a",
                  },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => openUPI(app.id)}
                    style={{
                      width: "100%",
                      padding: "15px 20px",
                      background: app.bg,
                      color: "white",
                      border: "none",
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "Jost, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <span style={{ fontSize: 20 }}>{app.emoji}</span>{" "}
                    {app.label}
                  </button>
                ))}
              </div>

              {/* UPI ID manual */}
              <div
                style={{
                  background: "#f5f5f5",
                  borderRadius: 12,
                  padding: "14px 16px",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7c6c",
                    marginBottom: 4,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Or pay manually to UPI ID
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1a2c1c",
                    letterSpacing: "0.04em",
                  }}
                >
                  {UPI_ID}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(UPI_ID);
                    toast.success("UPI ID copied!");
                  }}
                  style={{
                    marginTop: 8,
                    padding: "5px 16px",
                    background: "#1a2c1c",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "Jost, sans-serif",
                  }}
                >
                  Copy
                </button>
              </div>

              <button
                onClick={() => setStep("form")}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "transparent",
                  color: "#6b7c6c",
                  border: "1.5px solid #d8e8d4",
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Jost, sans-serif",
                }}
              >
                ← Go Back
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          🔒 Secure UPI Payment · Navbodh Organics · Raipur
        </div>
      </div>
    </div>
  );
};

export default Pay;
