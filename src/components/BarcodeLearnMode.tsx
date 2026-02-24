import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface BarcodeLearnModeProps {
  onClose: () => void;
}

export const BarcodeLearnMode = ({ onClose }: BarcodeLearnModeProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const scanBarcode = async () => {
      if (!isScanning || !webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        const result = await codeReader.current.decodeFromImageUrl(imageSrc);
        const barcode = result.getText();

        // Add to list if not already present
        if (!scannedCodes.includes(barcode)) {
          setScannedCodes(prev => [...prev, barcode]);
          toast.success("Barcode detected!", {
            description: barcode
          });
        }
      } catch (err) {
        if (!(err instanceof NotFoundException)) {
          console.error("Error scanning barcode:", err);
        }
      }
    };

    if (isScanning) {
      intervalId = setInterval(scanBarcode, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScanning, scannedCodes]);

  const copyToClipboard = (barcode: string) => {
    navigator.clipboard.writeText(barcode);
    setCopied(barcode);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Barcode Learning Mode</h3>
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

        <p className="text-sm text-muted-foreground">
          Scan your products to get their barcodes. You'll need to copy these and update the quest data.
        </p>

        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{
              facingMode: "environment",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-32 border-2 border-primary rounded-lg shadow-lg">
              <div className="w-full h-full border-2 border-white/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Scanned Barcodes ({scannedCodes.length}):</p>

          {scannedCodes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No barcodes scanned yet. Point camera at a barcode.
            </p>
          ) : (
            <div className="space-y-2">
              {scannedCodes.map((barcode, index) => (
                <Card key={index} className="p-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Product {index + 1}</p>
                    <p className="font-mono text-sm font-semibold truncate">{barcode}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(barcode)}
                    className="flex-shrink-0"
                  >
                    {copied === barcode ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-blue-900">Next Steps:</p>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Scan your products above</li>
            <li>Copy each barcode</li>
            <li>Update <code className="bg-blue-100 px-1 rounded">src/data/quests.ts</code></li>
            <li>Replace the placeholder barcodes with your copied ones</li>
            <li>Restart the app to test real scanning!</li>
          </ol>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsScanning(!isScanning)}
        >
          {isScanning ? "Pause Scanning" : "Resume Scanning"}
        </Button>
      </Card>
    </div>
  );
};
