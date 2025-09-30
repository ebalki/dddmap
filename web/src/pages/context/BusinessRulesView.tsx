import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const BusinessRulesView: React.FC = () => {
  const { currentContext } = useBoundedContext();

  if (!currentContext) return null;

  // Extract all business rules from context and aggregate responsibilities
  const contextRules = (currentContext.responsibilities || [])
    .filter(r => r.startsWith('RULE:'))
    .map(r => ({ source: 'Context', text: r.substring(6).trim() }));

  const aggregateRules = currentContext.aggregates.flatMap(aggregate =>
    (aggregate.responsibilities || [])
      .filter(r => r.startsWith('RULE:'))
      .map(r => ({ source: aggregate.name, text: r.substring(6).trim() }))
  );

  const allRules = [...contextRules, ...aggregateRules];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Business Rules</h1>
          </div>
          <p className="text-gray-600">Domain rules and invariants in {currentContext.name}</p>
        </div>

        {allRules.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No business rules defined for this context yet
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {allRules.map((rule, idx) => (
              <Card key={idx}>
                <CardHeader className="bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">BUSINESS RULE</span>
                    </div>
                    <Badge variant="aggregate">{rule.source}</Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-900">{rule.text}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Group by Aggregate */}
        {aggregateRules.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rules by Aggregate</h2>
            <div className="space-y-8">
              {currentContext.aggregates.map((aggregate) => {
                const rules = (aggregate.responsibilities || []).filter(r => r.startsWith('RULE:'));
                if (rules.length === 0) return null;

                return (
                  <div key={aggregate.name}>
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge variant="aggregate">{aggregate.name}</Badge>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {rules.length} Rule{rules.length !== 1 ? 's' : ''}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {rules.map((rule, idx) => {
                        const ruleText = rule.substring(6).trim();
                        return (
                          <div key={idx} className="border-l-4 border-green-500 bg-green-50 pl-4 py-3">
                            <p className="text-sm text-gray-900">{ruleText}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
