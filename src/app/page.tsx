"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Gift, ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

const YOGURTS = [
  {
    id: "blueberry",
    name: "Blueberry Bliss",
    image: "/images/Yogurts/blueberry.png",
    bowlFolder: "Blueberry Yogurt Bowl",
    baseImage: "blueberry yogurt bowl.png",
    filePrefix: "Blueberry yogurt bowl",
  },
  {
    id: "mango",
    name: "Mango Delight",
    image: "/images/Yogurts/mango.png",
    bowlFolder: "mango yogurt bowl",
    baseImage: "mango yogurt bowl.png",
    filePrefix: "Mango yogurt bowl",
  },
  {
    id: "peach",
    name: "Peach Glow",
    image: "/images/Yogurts/peach.png",
    bowlFolder: "peach yogurt bowl",
    baseImage: "peach yogurt bowl.png",
    filePrefix: "Peach yogurt bowl",
  },
  {
    id: "strawberry",
    name: "Berry Sweet",
    image: "/images/Yogurts/strawberry.png",
    bowlFolder: "strawberry yogurt bowl",
    baseImage: "strawberry yogurt bowl.png",
    filePrefix: "Strawberry yogurt bowl",
  },
];

const TOPPINGS = [
  {
    id: "banana",
    name: "Banana",
    image: "/images/Fruits_toppings/banana topping.png",
    fileLabel: "banana topping",
  },
  {
    id: "blueberry",
    name: "Blueberries",
    image: "/images/Fruits_toppings/blueberry_topping.png",
    fileLabel: "blueberry topping",
  },
  {
    id: "strawberry",
    name: "Strawberries",
    image: "/images/Fruits_toppings/strawberry topping.png",
    fileLabel: "strawberry topping",
  },
];

const SAUCES = [
  {
    id: "chocolate",
    name: "Chocolate Syrup",
    image: "/images/Syrups/chocolate syrup.png",
    fileLabel: "chocolate syrup",
  },
  {
    id: "honey",
    name: "Honey Syrup",
    image: "/images/Syrups/honey syrup.png",
    fileLabel: "honey syrup",
  },
];

const MAX_MESSAGE_LENGTH = 140;
const bowlTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};
const headingFont = "var(--font-roca), Arial, Helvetica, sans-serif";
const bodyFont = "var(--font-zeitung), Arial, Helvetica, sans-serif";
const SUGGESTED_MESSAGE = "Happy Mother's Day! I made this just for you with all my love 💕";

function getBowlRecipeImage(yogurt: string, toppings: string[], sauce: string): string | null {
  const yogurtConfig = YOGURTS.find((item) => item.id === yogurt);
  if (!yogurtConfig) return null;

  const toppingId = toppings[0];
  const toppingConfig = TOPPINGS.find((item) => item.id === toppingId);
  const sauceConfig = SAUCES.find((item) => item.id === sauce);

  if (
    yogurt === "strawberry" &&
    toppingId === "blueberry" &&
    sauce === "chocolate"
  ) {
    return "/images/strawberry yogurt bowl/Untitled-2.png";
  }

  if (toppingConfig && sauceConfig) {
    return `/images/${yogurtConfig.bowlFolder}/${yogurtConfig.filePrefix} + ${toppingConfig.fileLabel} + ${sauceConfig.fileLabel}.png`;
  }

  if (toppingConfig) {
    return `/images/${yogurtConfig.bowlFolder}/${yogurtConfig.filePrefix} + ${toppingConfig.fileLabel}.png`;
  }

  return `/images/${yogurtConfig.bowlFolder}/${yogurtConfig.baseImage}`;
}

export default function YogurtMaker() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [message, setMessage] = useState(
    SUGGESTED_MESSAGE.slice(0, MAX_MESSAGE_LENGTH)
  );
  const [selectedYogurt, setSelectedYogurt] = useState("");
  const [selectedTopping, setSelectedTopping] = useState("");
  const [selectedSauce, setSelectedSauce] = useState("");
  const [copied, setCopied] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const fillSuggestedMessage = () => {
    if (message.trim()) return;

    const nextMessage = SUGGESTED_MESSAGE.slice(0, MAX_MESSAGE_LENGTH);
    setMessage(nextMessage);

    requestAnimationFrame(() => {
      messageRef.current?.focus();
      const length = nextMessage.length;
      messageRef.current?.setSelectionRange(length, length);
    });
  };

  const toggleTopping = (id: string) =>
    setSelectedTopping((prev) => (prev === id ? "" : id));

  const canGoNext =
    step === 0 ? selectedYogurt !== "" :
    step === 1 ? true :
    step === 2 ? true : false;

  const giftLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/gift?n=${encodeURIComponent(name)}&mn=${encodeURIComponent(motherName)}&m=${encodeURIComponent(message)}&y=${selectedYogurt}&t=${selectedTopping}&s=${selectedSauce}`
      : "";

  const copyLink = () => {
    navigator.clipboard.writeText(giftLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Bowl preview — shared between builder and finish screen
  const renderBowlPreview = () => {
    const composedImage = getBowlRecipeImage(
      selectedYogurt,
      selectedTopping ? [selectedTopping] : [],
      selectedSauce
    );
    if (composedImage) {
      return (
        <AnimatePresence initial={false}>
          <motion.img
            key={composedImage}
            initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
            transition={bowlTransition}
            src={composedImage}
            alt="Yogurt Bowl"
            className="absolute inset-0 m-auto w-[90%] h-auto z-10 drop-shadow-xl will-change-transform"
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
          {selectedTopping && (
            <motion.img
              key={selectedTopping}
              initial={{ y: -50, opacity: 0, rotate: -20 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -50, opacity: 0 }}
              src={TOPPINGS.find(t => t.id === selectedTopping)?.image} alt={selectedTopping}
              className="absolute w-[65%] h-auto z-20"
            />
          )}
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
    <div className="min-h-dvh md:h-screen overflow-y-auto md:overflow-hidden font-sans relative" style={{ backgroundColor: "#f5f0e8" }}>
      {/* Subtle warm blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ backgroundColor: "#d63031" }} />
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: "#2563eb" }} />
      <div className="absolute -bottom-8 left-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000" style={{ backgroundColor: "#c9a96e" }} />

      <div className="max-w-5xl mx-auto min-h-dvh md:h-full px-3 sm:px-4 py-4 md:py-5 relative z-10 flex flex-col justify-start md:justify-center">
        {/* Header */}
        <header className="text-center mb-4 md:mb-6 pt-2 md:pt-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2"
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl leading-none font-extrabold" style={{ color: "#2d3436", fontFamily: headingFont }}>
              Yogurt Bowl Magic
            </h1>
          </motion.div>
          <p className="text-sm sm:text-base px-2" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>
            Create the perfect Mother&apos;s Day treat!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-start md:items-center">
          {/* Bowl Preview */}
          <motion.div
            className="relative aspect-square max-w-[250px] sm:max-w-[290px] md:max-w-md mx-auto w-full rounded-full p-4 sm:p-5 md:p-6 flex items-center justify-center shadow-xl border-4"
            style={{ backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none" }}
            layoutId="bowl-container"
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {renderBowlPreview()}
            </div>
          </motion.div>

          {/* Step Cards */}
          <div
            className="rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl border min-h-0 md:min-h-[390px] flex flex-col"
            style={{ backgroundColor: "#faf7f2", borderColor: "#e0d5c5" }}
          >
            <AnimatePresence mode="wait">
              {/* Step 0 — Yogurt base */}
              {step === 0 && (
                <motion.div key="step0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>1. Choose a Base</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Pick a yogurt flavor to start your bowl.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {YOGURTS.map((yogurt) => (
                      <button
                        key={yogurt.id}
                        onClick={() => setSelectedYogurt(yogurt.id)}
                        className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 overflow-hidden ${
                          selectedYogurt === yogurt.id ? "scale-105 shadow-lg" : "hover:scale-102"
                        }`}
                        style={{
                          borderColor: selectedYogurt === yogurt.id ? "#d63031" : "#e0d5c5",
                          backgroundColor: selectedYogurt === yogurt.id ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <img src={yogurt.image} alt={yogurt.name} className="w-16 h-16 md:w-20 md:h-20 object-contain relative z-10" />
                        <span className="text-xs sm:text-sm text-center" style={{ color: "#2d3436", fontFamily: bodyFont, fontWeight: 400 }}>{yogurt.name}</span>
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
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>2. Pick a Fruit Topping</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Choose one topping, or skip this step.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TOPPINGS.map((topping) => (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping.id)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 ${
                          selectedTopping === topping.id ? "scale-105 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: selectedTopping === topping.id ? "#2563eb" : "#e0d5c5",
                          backgroundColor: selectedTopping === topping.id ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <img src={topping.image} alt={topping.name} className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" />
                        <span className="text-xs sm:text-sm text-center leading-tight" style={{ color: "#2d3436", fontFamily: bodyFont, fontWeight: 400 }}>{topping.name}</span>
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
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>3. Add a Syrup</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Add a finishing drizzle, or skip.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {SAUCES.map((sauce) => (
                      <button
                        key={sauce.id}
                        onClick={() => setSelectedSauce(sauce.id === selectedSauce ? "" : sauce.id)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 ${
                          selectedSauce === sauce.id ? "scale-105 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: selectedSauce === sauce.id ? "#c9a96e" : "#e0d5c5",
                          backgroundColor: selectedSauce === sauce.id ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <img src={sauce.image} alt={sauce.name} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg" />
                        <span className="text-xs sm:text-sm text-center leading-tight" style={{ color: "#2d3436", fontFamily: bodyFont, fontWeight: 400 }}>{sauce.name}</span>
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
                      <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>Almost done!</h2>
                      <p className="text-sm" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Write a message for your Mom.</p>
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
                      ref={messageRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                      onClick={fillSuggestedMessage}
                      onKeyDown={(e) => {
                        if (e.key === "Shift" && !message.trim()) {
                          e.preventDefault();
                          fillSuggestedMessage();
                        }
                      }}
                      placeholder="e.g. Happy Mother's Day! I made this just for you with all my love 💕"
                      rows={3}
                      maxLength={MAX_MESSAGE_LENGTH}
                      className="w-full px-4 py-2.5 rounded-xl border-2 outline-none transition-all text-base resize-none"
                      style={{ borderColor: "#e0d5c5", backgroundColor: "#f5f0e8", color: "#2d3436" }}
                      onFocus={(e) => (e.target.style.borderColor = "#d63031")}
                      onBlur={(e) => (e.target.style.borderColor = "#e0d5c5")}
                    />
                    <p className="mt-2 text-xs" style={{ color: "#636e72", fontFamily: bodyFont }}>
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
              <div className="mt-5 flex justify-between items-center gap-3 pt-4" style={{ borderTop: "1px solid #e0d5c5" }}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
                  className="flex shrink-0 items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
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
