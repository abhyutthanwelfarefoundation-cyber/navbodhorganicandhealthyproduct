import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import toast from "react-hot-toast";

// ── Your QR code image — put your QR image in src/assets/qr.png ──
// If you don't have it as a file, we use a generated UPI QR via API
const UPI_ID = "Q12720464@ybl";
const UPI_NAME = "Navbodh Organics";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${UPI_ID}%26pn=${encodeURIComponent(UPI_NAME)}%26cu=INR`;

const Checkout = () => {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState("details"); // 'details' | 'payment'
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Raipur",
    paymentMethod: "upi",
    notes: "",
  });
  const [placing, setPlacing] = useState(false);
  const [txnId, setTxnId] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* Step 1 — validate & move to payment */
  const handleDetails = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone)
      return toast.error("Name and phone are required");
    if (form.phone.length !== 10 || !/^[6-9]/.test(form.phone))
      return toast.error("Enter a valid 10-digit mobile number");
    if (form.city.trim().toLowerCase() !== "raipur") {
      return toast.error(
        "Sorry, we currently deliver only in Raipur, Chhattisgarh.",
      );
    }
    if (form.paymentMethod === "cod") {
      handlePlace(); // COD → place directly
    } else {
      setStep("payment"); // UPI → show QR
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* Step 2 — place order after payment */
  const handlePlace = async () => {
    if (form.paymentMethod === "upi" && !txnId.trim()) {
      return toast.error("Please enter your UPI Transaction ID");
    }
    setPlacing(true);
    try {
      const orderData = {
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
        },
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          emoji: i.emoji,
          price: i.price,
          quantity: i.quantity,
          unit: i.unit,
        })),
        total,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentMethod === "upi" ? "paid" : "pending",
        txnId: txnId || null,
        notes: form.notes,
      };
      let result;
      try {
        result = await createOrder(orderData);
      } catch {
        result = { orderId: "NVB-" + Date.now().toString().slice(-6) };
      }
      dispatch({ type: "CLEAR_CART" });
      navigate(
        `/order-success?id=${result.orderId || result._id || "NVB-" + Date.now().toString().slice(-6)}&name=${encodeURIComponent(form.name)}&phone=${encodeURIComponent(form.phone)}&total=${total}&method=${form.paymentMethod}&txn=${encodeURIComponent(txnId)}`,
      );
    } catch {
      toast.error("Something went wrong. Please call us directly.");
    }
    setPlacing(false);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid var(--border-warm)",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    background: "white",
    color: "var(--ink)",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  /* ── PAYMENT STEP ── */
  if (step === "payment")
    return (
      <div
        style={{
          paddingTop: "var(--nav-h)",
          background: "var(--cream)",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            background: "var(--beige-warm)",
            borderBottom: "1px solid var(--border-warm)",
            padding: "28px 0",
          }}
        >
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              💳 Payment
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px,4vw,38px)",
                color: "var(--ink)",
              }}
            >
              Complete Payment
            </h1>
          </div>
        </div>

        <div
          className="container"
          style={{ padding: "clamp(24px,4vw,48px) 28px", maxWidth: 560 }}
        >
          {/* Amount banner */}
          <div
            style={{
              background: "var(--forest-deep)",
              borderRadius: 20,
              padding: "24px 28px",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              Amount to Pay
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px,6vw,56px)",
                fontWeight: 700,
                color: "var(--beige)",
              }}
            >
              ₹{total}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              To: {UPI_NAME}
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 28,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--ink-soft)",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Scan QR to Pay
            </div>

            {/* QR Image */}
            <div
              style={{
                display: "inline-block",
                padding: 12,
                background: "white",
                borderRadius: 16,
                border: "2px solid var(--forest-mist)",
                marginBottom: 16,
              }}
            >
              <img
                src={QR_URL}
                alt="UPI QR Code"
                width={200}
                height={200}
                style={{ display: "block", borderRadius: 8 }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 4,
              }}
            >
              UPI ID
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <code
                style={{
                  background: "var(--forest-mist)",
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--forest-deep)",
                  letterSpacing: "0.04em",
                }}
              >
                {UPI_ID}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(UPI_ID);
                  toast.success("UPI ID copied!");
                }}
                style={{
                  background: "var(--forest)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Copy
              </button>
            </div>

            {/* App buttons */}
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {[
                {
                  name: "GPay",
                  url: `gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR`,
                },
                {
                  name: "PhonePe",
                  url: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR`,
                },
                {
                  name: "Paytm",
                  url: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR`,
                },
              ].map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  style={{
                    background: "var(--cream)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--ink)",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {app.name}
                </a>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
              Tap to open payment app directly
            </div>
          </div>

          {/* Transaction ID */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "20px 22px",
              border: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-mid)",
                marginBottom: 8,
              }}
            >
              Enter UPI Transaction ID *
            </label>
            <input
              type="text"
              placeholder="e.g. 407612345678"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              style={inputStyle}
            />
            <div
              style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6 }}
            >
              Find it in your GPay / PhonePe / Paytm payment history
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={handlePlace}
            disabled={placing}
            style={{
              width: "100%",
              padding: "16px",
              background: placing ? "#666" : "var(--forest-deep)",
              color: "white",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: placing ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              marginBottom: 12,
            }}
          >
            {placing ? "⏳ Placing Order…" : "✅ I Have Paid — Confirm Order"}
          </button>

          <button
            onClick={() => setStep("details")}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: "var(--ink-soft)",
              border: "1.5px solid var(--border)",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            ← Back to Details
          </button>
        </div>
      </div>
    );

  /* ── DETAILS STEP ── */
  return (
    <div
      style={{
        paddingTop: "var(--nav-h)",
        background: "var(--cream)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "var(--beige-warm)",
          borderBottom: "1px solid var(--border-warm)",
          padding: "32px 0",
        }}
      >
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            📦 Checkout
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px,4vw,42px)",
              color: "var(--ink)",
            }}
          >
            Complete Your Order
          </h1>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: "#FFF3CD",
              border: "1px solid #FFE69C",
              borderRadius: 10,
              color: "#856404",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            🚚 We currently deliver only within Raipur, Chhattisgarh (CG).
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{ padding: "clamp(28px,4vw,48px) 28px" }}
      >
        <form onSubmit={handleDetails}>
          <div
            className="grid-2"
            style={{ gap: "clamp(24px,4vw,48px)", alignItems: "start" }}
          >
            {/* Customer details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "clamp(20px,3vw,32px)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    color: "var(--ink)",
                    marginBottom: 22,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  📋 Your Details
                </h2>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {[
                    {
                      k: "name",
                      l: "Full Name *",
                      ph: "Your full name",
                      t: "text",
                    },
                    {
                      k: "phone",
                      l: "Phone Number *",
                      ph: "10-digit number",
                      t: "tel",
                    },
                    {
                      k: "email",
                      l: "Email (optional)",
                      ph: "your@email.com",
                      t: "email",
                    },
                    {
                      k: "address",
                      l: "Delivery Address",
                      ph: "House, street, area",
                      t: "text",
                    },
                    { k: "city", l: "City", ph: "Raipur", t: "text" },
                  ].map((f) => (
                    <div key={f.k}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--ink-mid)",
                          marginBottom: 6,
                        }}
                      >
                        {f.l}
                      </label>
                      <input
                        type={f.t}
                        placeholder={f.ph}
                        value={form[f.k]}
                        onChange={(e) => set(f.k, e.target.value)}
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--forest-mid)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border-warm)")
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "clamp(20px,3vw,32px)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    color: "var(--ink)",
                    marginBottom: 18,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  💳 Payment Method
                </h2>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    {
                      k: "upi",
                      label: "📱 UPI / QR Code",
                      desc: "GPay, PhonePe, Paytm",
                    },
                    {
                      k: "cod",
                      label: "💵 Cash on Delivery",
                      desc: "Pay when delivered",
                    },
                  ].map((m) => (
                    <label
                      key={m.k}
                      onClick={() => set("paymentMethod", m.k)}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        border: "2px solid",
                        borderColor:
                          form.paymentMethod === m.k
                            ? "var(--forest)"
                            : "var(--border)",
                        borderRadius: 12,
                        cursor: "pointer",
                        background:
                          form.paymentMethod === m.k
                            ? "var(--forest-mist)"
                            : "white",
                        transition: "all 0.18s",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.k}
                        checked={form.paymentMethod === m.k}
                        onChange={() => set("paymentMethod", m.k)}
                        style={{
                          accentColor: "var(--forest)",
                          marginBottom: 6,
                        }}
                      />
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color:
                            form.paymentMethod === m.k
                              ? "var(--forest-deep)"
                              : "var(--ink)",
                        }}
                      >
                        {m.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--ink-soft)",
                          marginTop: 2,
                        }}
                      >
                        {m.desc}
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--ink-mid)",
                      marginBottom: 6,
                    }}
                  >
                    Special Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any special requests…"
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--forest-mid)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border-warm)")
                    }
                  />
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div
              style={{ position: "sticky", top: "calc(var(--nav-h) + 20px)" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 20,
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    background: "var(--forest-deep)",
                    padding: "20px 24px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    🧾 Order Summary
                  </h3>
                </div>
                <div>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px 20px",
                        borderBottom: "1px solid var(--forest-mist)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "var(--ink)",
                          }}
                        >
                          {item.emoji} {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ink-soft)",
                            marginTop: 2,
                          }}
                        >
                          ₹{item.price} × {item.quantity} {item.unit}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 18,
                          color: "var(--forest-deep)",
                        }}
                      >
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "var(--ink-soft)",
                    }}
                  >
                    <span>Delivery</span>
                    <span style={{ color: "var(--forest)", fontWeight: 700 }}>
                      FREE 🎉
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 18 }}>Total</span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 36,
                        color: "var(--forest-deep)",
                      }}
                    >
                      ₹{total}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "0 20px 24px" }}>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: 12,
                      padding: "10px",
                      background: "var(--forest-mist)",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--forest-deep)",
                    }}
                  >
                    🚚 Delivery available only in Raipur, Chhattisgarh (CG)
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "var(--forest-deep)",
                      color: "white",
                      border: "none",
                      borderRadius: 14,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {form.paymentMethod === "cod"
                      ? "✅ Place Order (COD)"
                      : "📱 Proceed to Pay →"}
                  </button>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 12,
                      fontSize: 12,
                      color: "var(--ink-soft)",
                    }}
                  >
                    🔒 Safe & Secure · Free delivery in Raipur
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <Link
                  to="/cart"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
