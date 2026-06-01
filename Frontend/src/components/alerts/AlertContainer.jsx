import AlertItem from "./AlertItem";

const AlertContainer = ({ alerts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {alerts.map((alert) => (
        <div key={alert.id} className="pointer-events-auto">
          <AlertItem alert={alert} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
