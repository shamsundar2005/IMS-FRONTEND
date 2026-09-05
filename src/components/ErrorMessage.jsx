export default function ErrorMessage({ message, onRetry }) {
  return (
    <p style={{ fontSize: 13.5, color: "#c0392b" }}>
      {message}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginLeft: 10, fontSize: 12.5, padding: "4px 10px",
            border: "1px solid #c0392b", color: "#c0392b", background: "#fff",
            borderRadius: 3, cursor: "pointer",
          }}
        >
          Retry
        </button>
      )}
    </p>
  );
}
