import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404 - Página não encontrada</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "2rem" }}>
        Ops! A página que você procura não existe ou foi removida.
      </p>
      <Link href="/">
        <button style={{ padding: "0.75rem 2rem", fontSize: "1rem", borderRadius: "8px", background: "#222", color: "#fff", border: "none", cursor: "pointer" }}>
          Voltar para a página inicial
        </button>
      </Link>
    </div>
  );
} 