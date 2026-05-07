"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";

import styles from "./page.module.css";

const MAX_MESSAGE_LENGTH = 140;
const YOGURTS = [
  {
    id: "blueberry",
    bowlFolder: "Blueberry Yogurt Bowl",
    baseImage: "blueberry yogurt bowl.png",
    filePrefix: "Blueberry yogurt bowl",
  },
  {
    id: "mango",
    bowlFolder: "mango yogurt bowl",
    baseImage: "mango yogurt bowl.png",
    filePrefix: "Mango yogurt bowl",
  },
  {
    id: "peach",
    bowlFolder: "peach yogurt bowl",
    baseImage: "peach yogurt bowl.png",
    filePrefix: "Peach yogurt bowl",
  },
  {
    id: "strawberry",
    bowlFolder: "strawberry yogurt bowl",
    baseImage: "strawberry yogurt bowl.png",
    filePrefix: "Strawberry yogurt bowl",
  },
];

const TOPPINGS = [
  { id: "banana", fileLabel: "banana topping" },
  { id: "blueberry", fileLabel: "blueberry topping" },
  { id: "strawberry", fileLabel: "strawberry topping" },
];

const TOPPING_ORDER = ["strawberry", "blueberry", "banana"] as const;

const SAUCES = [
  { id: "chocolate", fileLabel: "chocolate syrup" },
  { id: "honey", fileLabel: "honey syrup" },
];

const SAUCE_ORDER = ["chocolate", "honey"] as const;

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

function getBowlRecipeImage(yogurt: string | null, toppings: string[], sauces: string[]) {
  const yogurtConfig = YOGURTS.find((item) => item.id === yogurt);
  if (!yogurtConfig) return "/images/image.png";

  const orderedToppings = getOrderedToppings(toppings);
  const orderedSauces = getOrderedSauces(sauces);
  const toppingLabels = orderedToppings
    .map((toppingId) => TOPPINGS.find((item) => item.id === toppingId)?.fileLabel)
    .filter(Boolean)
    .join(" + ");
  const sauceLabels = getSauceLabels(orderedToppings, orderedSauces);

  if (yogurt === "strawberry" && orderedToppings.length === 1 && orderedToppings[0] === "blueberry" && orderedSauces.length === 1 && orderedSauces[0] === "chocolate") {
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

function createLetterText(message: string, motherName: string) {
  const source = message.slice(0, MAX_MESSAGE_LENGTH).trim();
  const greetingName = motherName.trim() || "Mom";

  const greeting = `Dear ${greetingName},`;

  if (!source) {
    return {
      greeting,
      body: "With all my love and a little extra sweetness just for you.",
    };
  }

  const body = source
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n");

  return {
    greeting,
    body,
  };
}

function GiftContent() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const name = searchParams.get("n") || "Someone special";
  const motherName = searchParams.get("mn") || "Mom";
  const message = searchParams.get("m") || "";
  const yogurt = searchParams.get("y");
  const toppingParam = searchParams.get("t");
  const sauceParam = searchParams.get("s");
  const toppings = toppingParam ? toppingParam.split(",").filter(Boolean) : [];
  const sauces = sauceParam ? sauceParam.split(",").filter(Boolean) : [];

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const letterContent = createLetterText(message, motherName);
  const bowlImage = getBowlRecipeImage(yogurt, toppings, sauces);

  return (
    <div className={styles.pageShell}>
      {isOpen && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={320}
          gravity={0.14}
          colors={["#c83f52", "#4d81ab", "#b69a62", "#f7f1e6", "#ffffff"]}
        />
      )}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="closed"
            type="button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.82, opacity: 0, y: 60 }}
            className={styles.closedCard}
            onClick={() => setIsOpen(true)}
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.3, ease: "easeInOut" }}
              className={styles.closedEnvelope}
            >
              <Image
                src="/images/letter_img.png"
                alt="Open greeting card"
                fill
                sizes="256px"
                className={styles.closedEnvelopeImage}
                priority
              />
            </motion.div>
            <span className={styles.closedLabel}>Tap to open your card</span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 95 }}
            className={styles.openCardStack}
          >
            <div className={styles.cardPerspective}>
              <div className={styles.postcardFrame}>
                <Image
                  src="/images/2ndborder.png"
                  alt=""
                  fill
                  sizes="100vw"
                  className={styles.borderImage}
                  priority
                />

                <div className={styles.postcardInner}>
                  <section className={styles.leftPanel}>
                    <div className={styles.headlineBlock}>
                      <div className={styles.headlineRow}>
                        <div className={styles.bouquetWrap}>
                          <Image
                            src="/images/boqueue.png"
                            alt=""
                            fill
                            sizes="72px"
                            className={styles.bouquetImage}
                            priority
                          />
                        </div>
                        <h1 className={styles.headline}>
                          Something extra special for the one who always gives a
                          little extra love
                        </h1>
                      </div>
                      <div className={styles.rule} />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35, type: "spring", stiffness: 90 }}
                      className={styles.bowlArtwork}
                    >
                      <Image
                        src={bowlImage}
                        alt="Yogurt bowl artwork"
                        fill
                        sizes="(max-width: 900px) 70vw, 34vw"
                        className={styles.artworkImage}
                        priority
                      />
                    </motion.div>
                  </section>

                  <section className={styles.rightPanel}>
                    <div className={styles.topDecorArea}>
                      <motion.div
                        initial={{ scale: 0.84, rotate: -4, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.55, type: "spring", damping: 14 }}
                        className={styles.decorCluster}
                      >
                        <div className={styles.stampCluster}>
                          <Image
                            src="/images/logo.png"
                            alt="For a Love Like Hers"
                            fill
                            sizes="240px"
                            className={styles.logoImage}
                            priority
                          />
                        </div>
                        <div className={styles.letterBadge}>
                          <Image
                            src="/images/letter_img.png"
                            alt=""
                            fill
                            sizes="150px"
                            className={styles.letterBadgeImage}
                            priority
                          />
                        </div>
                        <div className={styles.flowerWrap}>
                          <Image
                            src="/images/flower.png"
                            alt=""
                            fill
                            sizes="84px"
                            className={styles.flowerImage}
                            priority
                          />
                        </div>
                      </motion.div>
                    </div>

                    <div className={styles.noteArea}>
                      <div className={styles.letterContent}>
                        <p className={styles.letterGreeting}>{letterContent.greeting}</p>
                        <p className={styles.letterBody}>{letterContent.body}</p>
                      </div>
                    </div>

                    <div className={styles.signatureArea}>
                      <p className={styles.signatureLabel}>With love,</p>
                      <p className={styles.signatureName}>{name}</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <Link href="/" className={styles.makeYourOwnButton}>
              Make your own yogurt bowl
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GiftPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingShell}>
          <div className={styles.loadingSpinner} />
        </div>
      }
    >
      <GiftContent />
    </Suspense>
  );
}
