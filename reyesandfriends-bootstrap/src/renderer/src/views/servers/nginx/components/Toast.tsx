import { AnimatePresence, motion } from "framer-motion";

export default function Toast({
  visible,
  message,
  type = "success",
}: {
  visible: boolean;
  message: string;
  type?: "success" | "error";
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`callout ${type === "error" ? "alert" : "success"}`}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            margin: 0,
            borderRadius: 0,
            minWidth: 220,
            maxWidth: 400,
            zIndex: 1000,
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            whiteSpace: "pre-line",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
