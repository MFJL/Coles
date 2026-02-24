import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CameraOff, X, CheckCircle2, Keyboard } from "lucide-react";
import { Quest } from "@/data/quests";
import { toast } from "sonner";

interface BarcodeScannerProps {
  quests: Quest[];
  onScanSuccess: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ quests, onScanSuccess, onClose }: BarcodeScannerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const [matchedQuest, setMatchedQuest] = useState<Quest | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [manualInput, setManualInput] = useState<string>("");
  const codeReader = useRef(new BrowserMultiFormatReader());

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    // Check if the entered barcode matches any of our quest barcodes
    const quest = quests.find(q => q.barcode === manualInput.trim() && !q.completed);

    if (quest) {
      setMatchedQuest(quest);
      setIsScanning(false);

      setTimeout(() => {
        onScanSuccess(manualInput.trim());
        onClose();
      }, 2000);
    } else {
      toast.error("Barcode not found in available quests");
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const scanBarcode = async () => {
      if (!isScanning || cameraError || !webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        const result = await codeReader.current.decodeFromImageUrl(imageSrc);
        const barcode = result.getText();

        // Update last scanned code for debugging
        setLastScannedCode(barcode);

        // Check if the scanned barcode matches any of our quest barcodes
        const quest = quests.find(q => q.barcode === barcode && !q.completed);

        if (quest) {
          setMatchedQuest(quest);
          setIsScanning(false);

          setTimeout(() => {
            onScanSuccess(barcode);
            onClose();
          }, 2000);
        }
      } catch (err) {
        if (!(err instanceof NotFoundException)) {
          console.error("Error scanning barcode:", err);
        }
      }
    };

    if (isScanning && !cameraError) {
      intervalId = setInterval(scanBarcode, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScanning, cameraError, quests, onScanSuccess, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Scan Product Barcode</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {!isScanning ? (
            <div className="w-full h-full flex items-center justify-center bg-green-50">
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-scale-in" />
                <p className="font-semibold text-green-700">Match Found!</p>
                {matchedQuest && (
                  <div className="text-sm text-green-600">
                    <p>{matchedQuest.productName}</p>
                    <p className="font-bold">{matchedQuest.discount}</p>
                  </div>
                )}
              </div>
            </div>
          ) : cameraError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/50 p-4">
              <div className="text-center space-y-2">
                <CameraOff className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium text-foreground">Camera not available</p>
                <p className="text-xs text-muted-foreground">Enter the barcode below to continue</p>
              </div>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "environment" }}
                onUserMediaError={() => setCameraError(true)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-32 border-2 border-primary rounded-lg shadow-lg">
                  <div className="w-full h-full border-2 border-white/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            {!isScanning
              ? "Quest completed! Claiming reward..."
              : cameraError
              ? "Enter the barcode number from the product packaging"
              : "Position the barcode within the frame"}
          </p>

          {/* Manual Barcode Input — always visible, privacy-first design */}
          {(isScanning) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-gray-600" />
                <p className="text-xs font-semibold text-gray-700">Or enter barcode manually:</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleManualSubmit();
                    }
                  }}
                  placeholder="Enter barcode number"
                  className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={handleManualSubmit}
                  size="sm"
                  className="px-4"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {/* Show last scanned barcode for debugging */}
          {lastScannedCode && isScanning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-xs font-semibold text-blue-900">Last detected:</p>
              <p className="text-xs font-mono text-blue-700">{lastScannedCode}</p>
            </div>
          )}

          {/* Demo helper: Show which barcodes we're looking for */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Looking for:</p>
            {quests.filter(q => !q.completed).map(quest => (
              <div key={quest.id} className="text-xs text-muted-foreground flex justify-between gap-2">
                <span className="truncate">{quest.productName}</span>
                <span className="font-mono flex-shrink-0">{quest.barcode}</span>
              </div>
            ))}
          </div>

          {/* Demo: Manual input for testing */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Demo: Manual barcode input
            </summary>
            <div className="mt-2 space-y-2">
              {quests.filter(q => !q.completed).map(quest => (
                <Button
                  key={quest.id}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setMatchedQuest(quest);
                    setIsScanning(false);
                    setTimeout(() => {
                      onScanSuccess(quest.barcode);
                      onClose();
                    }, 2000);
                  }}
                >
                  Scan {quest.productName}
                </Button>
              ))}
            </div>
          </details>
        </div>
      </Card>
    </div>
  );
};