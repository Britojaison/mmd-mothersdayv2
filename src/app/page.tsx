"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Gift, ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

const YOGURTS = [
  { id: "mango", name: "Mango Delight", image: "/images/yogurts/mango yogurt(cartoon).png", color: "bg-orange-100" },
  { id: "strawberry", name: "Berry Sweet", image: "/images/yogurts/strawberry yogurt(cartoon).png", color: "bg-rose-100" },
];

const TOPPINGS = [
  { id: "blueberries", name: "Blueberries", image: "/images/toppings/blueberries.png" },
  { id: "chocolate", name: "Chocolate Chips", image: "/images/toppings/chocolate.png" },
  { id: "mango", name: "Fresh Mango", image: "/images/toppings/mango.png" },
  { id: "strawberry", name: "Strawberries", image: "/images/toppings/strawberry.png" },
];

const SAUCES = [
  { id: "choco syrup", name: "Chocolate Syrup", image: "/images/sauses/choco syrup.png" },
  { id: "strawberry syrup", name: "Strawberry Syrup", image: "/images/sauses/strawberry syrup.png" },
];

const MAX_MESSAGE_LENGTH = 140;

function getStrawberryRecipeImage(yogurt: string, toppings: string[], sauce: string): string | null {
  if (yogurt !== "strawberry") return null;
  const onlyStrawberry = toppings.length === 1 && toppings.includes("strawberry");
  if (onlyStrawberry && sauce === "strawberry syrup")
    return "/images/strawberry yogurt/strawberrybowl_withstrawberries_strawberrysyrup.png";
  if (onlyStrawberry && !sauce)
    return "/images/strawberry yogurt/strawberrybowl_with strawberries.png";
  if (toppings.length === 0 && !sauce)
    return "/images/strawberry yogurt/strawberrybowl.png";
  return null;
}

export default function YogurtMaker() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedYogurt, setSelectedYogurt] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleTopping = (id: string) =>
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const canGoNext =
    step === 0 ? selectedYogurt !== "" :
    step === 1 ? true :
    step === 2 ? true : false;

  const giftLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/gift?n=${encodeURIComponent(name)}&mn=${encodeURIComponent(motherName)}&m=${encodeURIComponent(message)}&y=${selectedYogurt}&t=${selectedToppings.join(",")}&s=${selectedSauce}`
      : "";

  const copyLink = () => {
    navigator.clipboard.writeText(giftLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Bowl preview — shared between builder and finish screen
  const renderBowlPreview = () => {
    const composedImage = getStrawberryRecipeImage(selectedYogurt, selectedToppings, selectedSauce);
    if (composedImage) {
      return (
        <AnimatePresence mode="wait">
          <motion.img
            key={composedImage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            src={composedImage}
            alt="Yogurt Bowl"
            className="absolute w-[90%] h-auto z-10 drop-shadow-xl"
          />
        </AnimatePresence>
      );
    }
    return (
      <>
        <img src="/images/empty bowl.png" alt="Empty Bowl" className="absolute w-[90%] h-auto z-0 drop-shadow-xl" />
        <AnimatePresence>
          {selectedYogurt && (
            <motion.img
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              src={YOGURTS.find(y => y.id === selectedYogurt)?.image} alt="Yogurt"
              className="absolute w-[75%] h-auto z-10"
            />
          )}
          {selectedToppings.map((id) => (
            <motion.img
              key={id}
              initial={{ y: -50, opacity: 0, rotate: -20 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -50, opacity: 0 }}
              src={TOPPINGS.find(t => t.id === id)?.image} alt={id}
              className="absolute w-[65%] h-auto z-20"
            />
          ))}
          {selectedSauce && (
            <motion.img
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              src={SAUCES.find(s => s.id === selectedSauce)?.image} alt="Sauce"
              className="absolute w-[70%] h-auto z-30"
            />
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="h-screen overflow-hidden font-sans relative" style={{ backgroundColor: "#f5f0e8" }}>
      {/* Subtle warm blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ backgroundColor: "#d63031" }} />
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: "#2563eb" }} />
      <div className="absolute -bottom-8 left-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" style={{ backgroundColor: "#c9a96e" }} />

      <div className="max-w-4xl mx-auto h-full px-4 py-4 md:py-5 relative z-10 flex flex-col justify-center">
        {/* Header */}
        <header className="text-center mb-5 md:mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-3 mb-2"
          >
            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
            <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: "#2d3436" }}>
              Yogurt Bowl Magic
            </h1>
            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
          </motion.div>
          <p className="text-sm md:text-base font-medium" style={{ color: "#636e72" }}>
            Create the perfect Mother&apos;s Day treat!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center">
          {/* Bowl Preview */}
          <motion.div
            className="relative aspect-square max-w-[280px] md:max-w-sm mx-auto w-full rounded-full p-5 md:p-6 flex items-center justify-center shadow-xl border-4"
            style={{ backgroundColor: "#ede8dc", borderColor: "#c9a96e" }}
            layoutId="bowl-container"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {renderBowlPreview()}
            </div>
          </motion.div>

          {/* Step Cards */}
          <div
            className="rounded-3xl p-5 md:p-6 shadow-xl border min-h-[360px] md:min-h-[390px] flex flex-col"
            style={{ backgroundColor: "#faf7f2", borderColor: "#e0d5c5" }}
          >
            <AnimatePresence mode="wait">
              {/* Step 0 — Yogurt base */}
              {step === 0 && (
                <motion.div key="step0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436" }}>1. Choose a Base</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72" }}>Pick a yogurt flavor to start your bowl.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {YOGURTS.map((yogurt) => (
                      <button
                        key={yogurt.id}
                        onClick={() => setSelectedYogurt(yogurt.id)}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden ${
                          selectedYogurt === yogurt.id ? "scale-105 shadow-lg" : "hover:scale-102"
                        }`}
                        style={{
                          borderColor: selectedYogurt === yogurt.id ? "#d63031" : "#e0d5c5",
                          backgroundColor: selectedYogurt === yogurt.id ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <img src={yogurt.image} alt={yogurt.name} className="w-16 h-16 md:w-20 md:h-20 object-contain relative z-10" />
                        <span className="font-bold text-sm" style={{ color: "#2d3436" }}>{yogurt.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1 — Toppings */}
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436" }}>2. Add Toppings</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72" }}>Pick as many as you like, or skip.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TOPPINGS.map((topping) => (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                          selectedToppings.includes(topping.id) ? "scale-105 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: selectedToppings.includes(topping.id) ? "#2563eb" : "#e0d5c5",
                          backgroundColor: selectedToppings.includes(topping.id) ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <img src={topping.image} alt={topping.name} className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" />
                        <span className="font-semibold text-sm text-center leading-tight" style={{ color: "#2d3436" }}>{topping.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Sauce */}
              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436" }}>3. Drizzle some Sauce</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72" }}>Add a finishing drizzle, or skip.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {SAUCES.map((sauce) => (
                      <button
                        key={sauce.id}
                        onClick={() => setSelectedSauce(sauce.id === selectedSauce ? "" : sauce.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                          selectedSauce === sauce.id ? "scale-105 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: selectedSauce === sauce.id ? "#c9a96e" : "#e0d5c5",
                          backgroundColor: selectedSauce === sauce.id ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <img src={sauce.image} alt={sauce.name} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg" />
                        <span className="font-semibold text-sm text-center leading-tight" style={{ color: "#2d3436" }}>{sauce.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Name + Message + Share */}
              {step === 3 && (
                <motion.div key="step3" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex-1 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#d4edda" }}>
                      <Check className="w-5 h-5" style={{ color: "#2d6a4f" }} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436" }}>Almost done!</h2>
                      <p className="text-sm" style={{ color: "#636e72" }}>Write a message for your Mom.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#2d3436" }}>Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-4 py-2.5 rounded-xl border-2 outline-none transition-all text-base"
                      style={{ borderColor: "#e0d5c5", backgroundColor: "#f5f0e8", color: "#2d3436" }}
                      onFocus={(e) => (e.target.style.borderColor = "#d63031")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0d5c5")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#2d3436" }}>Mother&apos;s Name</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="e.g. Mom, Amma, Sarah"
                      className="w-full px-4 py-2.5 rounded-xl border-2 outline-none transition-all text-base"
                      style={{ borderColor: "#e0d5c5", backgroundColor: "#f5f0e8", color: "#2d3436" }}
                      onFocus={(e) => (e.target.style.borderColor = "#d63031")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0d5c5")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#2d3436" }}>Message for Mom</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                      placeholder="e.g. Happy Mother's Day! I made this just for you with all my love 💕"
                      rows={3}
                      maxLength={MAX_MESSAGE_LENGTH}
                      className="w-full px-4 py-2.5 rounded-xl border-2 outline-none transition-all text-base resize-none"
                      style={{ borderColor: "#e0d5c5", backgroundColor: "#f5f0e8", color: "#2d3436" }}
                      onFocus={(e) => (e.target.style.borderColor = "#d63031")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0d5c5")}
                    />
                    <p className="mt-2 text-xs" style={{ color: "#636e72" }}>
                      {message.length}/{MAX_MESSAGE_LENGTH} characters
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={copyLink}
                      disabled={!name.trim()}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2"
                      style={{ borderColor: "#e0d5c5", backgroundColor: "#ede8dc", color: "#2d3436" }}
                    >
                      {copied ? <Check className="w-5 h-5" style={{ color: "#2d6a4f" }} /> : <Copy className="w-5 h-5" />}
                      {copied ? "Link Copied!" : "Copy Gift Link"}
                    </button>
                    {name.trim() && (
                      <Link
                        href={giftLink.replace(typeof window !== "undefined" ? window.location.origin : "", "")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold shadow-md transition-all text-white"
                        style={{ backgroundColor: "#d63031" }}
                      >
                        <Gift className="w-5 h-5" />
                        Preview Gift Card
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {step < 3 && (
              <div className="mt-5 flex justify-between items-center pt-4" style={{ borderTop: "1px solid #e0d5c5" }}>
                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1 font-semibold transition-colors text-sm"
                      style={{ color: "#636e72" }}
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  <div className="flex gap-2 ml-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: i === step ? "2rem" : "0.75rem",
                          backgroundColor: i === step ? "#d63031" : i < step ? "#e8a0a0" : "#e0d5c5",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canGoNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
                  style={{ backgroundColor: "#2d3436" }}
                >
                  {step === 2 ? "Finish" : "Next"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm underline transition-colors"
                  style={{ color: "#636e72" }}
                >
                  ← Go back and edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
