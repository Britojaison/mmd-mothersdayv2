"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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

const TOPPING_ORDER = ["strawberry", "blueberry", "banana"] as const;

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

const SAUCE_ORDER = ["chocolate", "honey"] as const;

const MAX_MESSAGE_LENGTH = 140;
const bowlTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};
const headingFont = "var(--font-roca), Arial, Helvetica, sans-serif";
const bodyFont = "var(--font-zeitung), Arial, Helvetica, sans-serif";
const SUGGESTED_MESSAGE = "Happy Mother's Day! I made this just for you with all my love 💕";

function encodePublicAssetPath(path: string) {
  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}

function getOrderedToppings(toppings: string[]) {
  return [...new Set(toppings)]
    .filter((topping) => TOPPINGS.some((item) => item.id === topping))
    .sort(
      (left, right) =>
        TOPPING_ORDER.indexOf(left as (typeof TOPPING_ORDER)[number]) -
        TOPPING_ORDER.indexOf(right as (typeof TOPPING_ORDER)[number])
    );
}

function getOrderedSauces(sauces: string[]) {
  return [...new Set(sauces)]
    .filter((sauce) => SAUCES.some((item) => item.id === sauce))
    .sort(
      (left, right) =>
        SAUCE_ORDER.indexOf(left as (typeof SAUCE_ORDER)[number]) -
        SAUCE_ORDER.indexOf(right as (typeof SAUCE_ORDER)[number])
    );
}

function getSauceLabels(orderedToppings: string[], orderedSauces: string[]) {
  if (
    orderedSauces.length === 2 &&
    orderedToppings.length === 1 &&
    orderedToppings[0] === "blueberry"
  ) {
    return orderedSauces
      .slice()
      .reverse()
      .map((sauceId) => SAUCES.find((item) => item.id === sauceId)?.fileLabel)
      .filter(Boolean)
      .join(" + ");
  }

  return orderedSauces
    .map((sauceId) => SAUCES.find((item) => item.id === sauceId)?.fileLabel)
    .filter(Boolean)
    .join(" + ");
}

function getBowlRecipeImage(yogurt: string, toppings: string[], sauces: string[]): string | null {
  const yogurtConfig = YOGURTS.find((item) => item.id === yogurt);
  if (!yogurtConfig) return null;

  const orderedToppings = getOrderedToppings(toppings);
  const orderedSauces = getOrderedSauces(sauces);
  const toppingLabels = orderedToppings
    .map((toppingId) => TOPPINGS.find((item) => item.id === toppingId)?.fileLabel)
    .filter(Boolean)
    .join(" + ");
  const sauceLabels = getSauceLabels(orderedToppings, orderedSauces);

  if (
    yogurt === "strawberry" &&
    orderedToppings.length === 1 &&
    orderedToppings[0] === "blueberry" &&
    orderedSauces.length === 1 &&
    orderedSauces[0] === "chocolate"
  ) {
    return encodePublicAssetPath("/images/strawberry yogurt bowl/Untitled-2.png");
  }

  if (toppingLabels && sauceLabels) {
    return encodePublicAssetPath(`/images/${yogurtConfig.bowlFolder}/${yogurtConfig.filePrefix} + ${toppingLabels} + ${sauceLabels}.png`);
  }

  if (toppingLabels) {
    return encodePublicAssetPath(`/images/${yogurtConfig.bowlFolder}/${yogurtConfig.filePrefix} + ${toppingLabels}.png`);
  }

  return encodePublicAssetPath(`/images/${yogurtConfig.bowlFolder}/${yogurtConfig.baseImage}`);
}

export default function YogurtMaker() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [message, setMessage] = useState(
    SUGGESTED_MESSAGE.slice(0, MAX_MESSAGE_LENGTH)
  );
  const [selectedYogurt, setSelectedYogurt] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
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
    setSelectedToppings((prev) =>
      prev.includes(id)
        ? prev.filter((topping) => topping !== id)
        : getOrderedToppings([...prev, id])
    );

  const toggleSauce = (id: string) =>
    setSelectedSauces((prev) =>
      prev.includes(id)
        ? prev.filter((sauce) => sauce !== id)
        : getOrderedSauces([...prev, id])
    );

  const canGoNext =
    step === 0 ? selectedYogurt !== "" :
    step === 1 ? true :
    step === 2 ? true : false;

  const giftLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/gift?n=${encodeURIComponent(name)}&mn=${encodeURIComponent(motherName)}&m=${encodeURIComponent(message)}&y=${selectedYogurt}&t=${encodeURIComponent(selectedToppings.join(","))}&s=${encodeURIComponent(selectedSauces.join(","))}`
      : "";

  const copyLink = async () => {
    if (!giftLink) return;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: "Mother's Day Yogurt Bowl Gift",
          text: "Here is your custom Mother's Day yogurt bowl card.",
          url: giftLink,
        });
      } else if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(giftLink);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = giftLink;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } else {
        return;
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Users can cancel native share without it being an actual copy failure.
      if (error instanceof Error && error.name === "AbortError") return;

      if (typeof window !== "undefined") {
        window.prompt("Share or copy this gift link:", giftLink);
      }
    }
  };

  // Bowl preview — shared between builder and finish screen
  const renderBowlPreview = () => {
    const composedImage = getBowlRecipeImage(
      selectedYogurt,
      selectedToppings,
      selectedSauces
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
        <Image src="/images/bowl.png" alt="Empty Bowl" fill className="object-contain z-0 drop-shadow-xl" />
        <AnimatePresence>
          {selectedYogurt && (
            <motion.img
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              src={YOGURTS.find(y => y.id === selectedYogurt)?.image} alt="Yogurt"
              className="absolute w-[75%] h-auto z-10"
            />
          )}
          {selectedToppings.map((selectedTopping, index) => (
            <motion.img
              key={selectedTopping}
              initial={{ y: -50, opacity: 0, rotate: -20 }}
              animate={{ y: index * 2, opacity: 1, rotate: 0 }}
              exit={{ y: -50, opacity: 0 }}
              src={TOPPINGS.find(t => t.id === selectedTopping)?.image} alt={selectedTopping}
              className="absolute w-[65%] h-auto z-20"
            />
          ))}
          {selectedSauces.map((selectedSauce, index) => (
            <motion.img
              key={selectedSauce}
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              src={SAUCES.find(s => s.id === selectedSauce)?.image} alt="Sauce"
              className="absolute w-[70%] h-auto z-30"
              style={{ transform: `translateY(${index * 2}px)` }}
            />
          ))}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="min-h-dvh md:h-screen overflow-x-hidden md:overflow-hidden font-sans relative" style={{ backgroundColor: "#f5f0e8" }}>
      {/* Subtle warm blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ backgroundColor: "#d63031" }} />
      <div
        className="absolute top-10 right-10 w-40 h-40 rounded-full filter blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: "#2563eb" }}
      />
      <div className="absolute -bottom-8 left-20 w-40 h-40 rounded-full filter blur-3xl opacity-25 animate-blob animation-delay-4000 pointer-events-none" style={{ backgroundColor: "#c9a96e" }} />

      <div className="max-w-5xl mx-auto min-h-dvh md:h-full px-3 sm:px-4 py-4 md:py-5 relative z-10 flex flex-col justify-start md:justify-center">
        {/* Header */}
        <header className="text-center mb-4 md:mb-6 pt-2 md:pt-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2"
          >
            <Image src="/images/logo.png" alt="Logo" width={56} height={56} className="object-contain" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl leading-none font-extrabold" style={{ color: "#2d3436", fontFamily: headingFont }}>
              The Sweetest Treat for Your Mom
            </h1>
          </motion.div>
          <p className="text-sm sm:text-base px-2" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>
            Build a yogurt bowl made just for Mum.
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
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>1. Pick Her Spoonful of Happiness</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Choose the flavor that feels most like her</p>
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
                        <Image src={yogurt.image} alt={yogurt.name} width={80} height={80} className="object-contain relative z-10" />
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
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>2. Top It with Mum’s Favorites</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Pick the fruit she&apos;d love most</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TOPPINGS.map((topping) => (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping.id)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 ${
                          selectedToppings.includes(topping.id) ? "scale-105 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: selectedToppings.includes(topping.id) ? "#2563eb" : "#e0d5c5",
                          backgroundColor: selectedToppings.includes(topping.id) ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <Image src={topping.image} alt={topping.name} width={64} height={64} className="object-contain drop-shadow-md" />
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
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>3. Finish with Something Sweet</h2>
                    <p className="text-sm mt-1" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Choose the syrup she&apos;d enjoy most</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {SAUCES.map((sauce) => (
                      <button
                        key={sauce.id}
                        onClick={() => toggleSauce(sauce.id)}
                        className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-3 ${
                          selectedSauces.includes(sauce.id) ? "scale-105 shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: selectedSauces.includes(sauce.id) ? "#c9a96e" : "#e0d5c5",
                          backgroundColor: selectedSauces.includes(sauce.id) ? "#fff" : "#f5f0e8",
                        }}
                      >
                        <Image src={sauce.image} alt={sauce.name} width={80} height={80} className="object-contain drop-shadow-lg" />
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
                      <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#2d3436", fontFamily: headingFont }}>Almost Mum-ready!</h2>
                      <p className="text-sm" style={{ color: "#636e72", fontFamily: bodyFont, fontWeight: 400 }}>Add the names and a sweet note just for her.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1" style={{ color: "#2d3436" }}>Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full px-3 sm:px-4 py-2.5 rounded-xl border-2 outline-none transition-all text-sm sm:text-base"
                        style={{ borderColor: "#e0d5c5", backgroundColor: "#f5f0e8", color: "#2d3436" }}
                        onFocus={(e) => (e.target.style.borderColor = "#d63031")}
                        onBlur={(e) => (e.target.style.borderColor = "#e0d5c5")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1" style={{ color: "#2d3436" }}>Mum&apos;s Name</label>
                      <input
                        type="text"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="e.g. Mom"
                        className="w-full px-3 sm:px-4 py-2.5 rounded-xl border-2 outline-none transition-all text-sm sm:text-base"
                        style={{ borderColor: "#e0d5c5", backgroundColor: "#f5f0e8", color: "#2d3436" }}
                        onFocus={(e) => (e.target.style.borderColor = "#d63031")}
                        onBlur={(e) => (e.target.style.borderColor = "#e0d5c5")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: "#2d3436" }}>Your Message for Mum</label>
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

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={copyLink}
                      disabled={!name.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 text-xs sm:text-base whitespace-nowrap"
                      style={{ borderColor: "#e0d5c5", backgroundColor: "#ede8dc", color: "#2d3436" }}
                    >
                      {copied ? <Check className="w-5 h-5" style={{ color: "#2d6a4f" }} /> : <Copy className="w-5 h-5" />}
                      {copied ? "Link Ready!" : "Share the Love"}
                    </button>
                    {name.trim() && (
                      <Link
                        href={giftLink.replace(typeof window !== "undefined" ? window.location.origin : "", "")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-6 rounded-xl font-bold shadow-md transition-all text-white text-xs sm:text-base whitespace-nowrap"
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
