export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="loading-ball"></div>
        </div>
        <p className="loading-text">Chargement...</p>
      </div>
    </div>
  );
}
  