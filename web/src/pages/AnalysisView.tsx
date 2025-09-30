import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { UnmappedElementsPanel } from '../components/UnmappedElementsPanel';
import type { MappingTarget } from '../components/UnmappedElementsPanel';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { DDDAnalysisResult, UnmappedElement, MappedElement, ContextMappingModel } from '../types/cml.types';
import { parseCML } from '../utils/cmlParser';

export function AnalysisView() {
  const [analysisResult, setAnalysisResult] = useState<DDDAnalysisResult | null>(null);
  const [parsedModel, setParsedModel] = useState<ContextMappingModel | null>(null);
  const [unmappedElements, setUnmappedElements] = useState<UnmappedElement[]>([]);
  const [mappedElements, setMappedElements] = useState<MappedElement[]>([]);
  const [loading, setLoading] = useState(false);

  // Load sample data on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    setLoading(true);
    try {
      // Load sample CML file
      const response = await fetch('/sample-ecommerce.cml');
      const cmlContent = await response.text();

      // Parse CML
      const model = parseCML(cmlContent);
      setParsedModel(model);

      // Sample unmapped elements
      const sampleUnmapped: UnmappedElement[] = [
        {
          id: 'um_001',
          type: 'action',
          name: 'calculateShippingCost',
          description:
            'Calculates shipping cost based on order weight, destination zip code, and carrier rates. Applies volume discounts for orders over $100.',
          location: 'src/services/OrderProcessor.java:156',
        },
        {
          id: 'um_002',
          type: 'structure',
          name: 'OrderAuditLog',
          description:
            'Database table storing all changes to orders including timestamp, user, old values, and new values for compliance tracking.',
          location: 'schema/orders.sql:45',
        },
        {
          id: 'um_003',
          type: 'action',
          name: 'sendConfirmationEmail',
          description:
            'Sends order confirmation email to customer with order details, estimated delivery date, and tracking information when available.',
          location: 'src/notifications/EmailService.java:89',
        },
        {
          id: 'um_004',
          type: 'structure',
          name: 'InventorySnapshot',
          description:
            'Cached view of inventory levels updated every 5 minutes. Used for fast stock availability checks on product pages.',
          location: 'src/cache/InventoryCache.java:34',
        },
        {
          id: 'um_005',
          type: 'action',
          name: 'validateCreditCard',
          description:
            'Validates credit card number using Luhn algorithm and checks expiration date. Does not store full card numbers.',
          location: 'src/payment/CardValidator.java:67',
        },
      ];

      setAnalysisResult({
        cml: cmlContent,
        unmappedElements: sampleUnmapped,
        metadata: {
          sourceProject: 'legacy-ecommerce',
          analyzedAt: new Date().toISOString(),
          agentVersion: '1.0.0',
        },
      });

      setUnmappedElements(sampleUnmapped);
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await file.text();
      const data: DDDAnalysisResult = JSON.parse(content);

      // Parse CML
      const model = parseCML(data.cml);
      setParsedModel(model);

      setAnalysisResult(data);
      setUnmappedElements(data.unmappedElements);
      setMappedElements([]);
    } catch (error) {
      console.error('Error loading analysis file:', error);
      alert('Failed to load analysis file. Please check the file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleMap = (unmappedId: string, mapping: MappingTarget) => {
    // Create mapped element
    const mapped: MappedElement = {
      unmappedId,
      mappedTo: mapping,
      mappedAt: new Date().toISOString(),
    };

    // Add to mapped elements
    setMappedElements([...mappedElements, mapped]);

    // Remove from unmapped elements
    setUnmappedElements(unmappedElements.filter((el) => el.id !== unmappedId));

    console.log('Mapped element:', mapped);
  };

  const handleSkip = (unmappedId: string) => {
    // Remove from unmapped elements (user decided to skip)
    setUnmappedElements(unmappedElements.filter((el) => el.id !== unmappedId));
    console.log('Skipped element:', unmappedId);
  };

  const handleExportResults = () => {
    const results = {
      originalAnalysis: analysisResult,
      mappedElements,
      remainingUnmapped: unmappedElements,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ddd-mapping-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell currentContext={null}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DDD Analysis & Mapping
          </h1>
          <p className="text-gray-600">
            Review AI-generated DDD model and map unmapped elements from legacy codebase
          </p>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">Loading analysis...</p>
          </Card>
        ) : !analysisResult ? (
          // Upload Interface
          <Card className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Analysis Results
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a JSON file containing DDD analysis results from the AI agent
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </label>
              <p className="text-xs text-gray-500">
                or using sample e-commerce data
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bounded Contexts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parsedModel?.boundedContexts.length || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unmapped Elements</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {unmappedElements.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mapped Elements</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mappedElements.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExportResults}>
                Export Results
              </Button>
              <Button variant="outline" onClick={() => {
                const a = document.createElement('a');
                a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(analysisResult.cml);
                a.download = 'model.cml';
                a.click();
              }}>
                Download CML
              </Button>
            </div>

            {/* Unmapped Elements Panel */}
            {parsedModel && (
              <UnmappedElementsPanel
                unmappedElements={unmappedElements}
                boundedContexts={parsedModel.boundedContexts}
                onMap={handleMap}
                onSkip={handleSkip}
              />
            )}

            {/* Mapped Elements Summary */}
            {mappedElements.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mapped Elements ({mappedElements.length})
                </h3>
                <div className="space-y-2">
                  {mappedElements.map((mapped) => {
                    const original = analysisResult.unmappedElements.find(
                      (el) => el.id === mapped.unmappedId
                    );
                    return (
                      <div
                        key={mapped.unmappedId}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {original?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Mapped to {mapped.mappedTo.contextName} → {mapped.mappedTo.aggregateName} → {mapped.mappedTo.elementType}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
