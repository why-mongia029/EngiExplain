'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {toast} from "@/hooks/use-toast"
import {useToast as useToastHook} from "@/hooks/use-toast"
import {Lightbulb} from "lucide-react";

import {simplifyEngineeringConcept} from '@/ai/flows/simplify-engineering-concept';
import {improveExplanationWithFeedback} from '@/ai/flows/improve-explanation-with-feedback';

const Home = () => {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [simplifiedExplanation, setSimplifiedExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const {toast} = useToastHook();

  const handleConceptSimplification = async () => {
    setLoading(true);
    try {
      const result = await simplifyEngineeringConcept({concept});
      setSimplifiedExplanation(result.simplifiedExplanation);
    } catch (error: any) {
      console.error('Error simplifying concept:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  const handleExplanationImprovement = async () => {
    setLoading(true);
    try {
      const result = await improveExplanationWithFeedback({
        concept,
        explanation: simplifiedExplanation,
        feedback,
      });
      setSimplifiedExplanation(result.improvedExplanation);
      toast({
        title: "Success",
        description: "Explanation improved!",
      })
    } catch (error: any) {
      console.error('Error improving explanation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-gray-100">
      <header className="w-full max-w-4xl px-4 text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-500">EngiExplain</h1>
        <p className="text-gray-600 mt-2">
          Simplify complex engineering concepts with AI.
        </p>
      </header>

      <main className="w-full max-w-4xl px-4">
        <section className="mb-6 flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter engineering concept"
            className="w-full rounded-md shadow-sm"
            value={concept}
            onChange={e => setConcept(e.target.value)}
          />
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm disabled:cursor-not-allowed"
            onClick={handleConceptSimplification}
            disabled={loading || !concept}
          >
            {loading ? 'Simplifying...' :
              <>
                Simplify Concept
                <Lightbulb className="ml-2 h-4 w-4"/>
              </>
            }
          </Button>
        </section>

        <Card className="mb-6 rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Simplified Explanation</CardTitle>
            <CardDescription>
              {simplifiedExplanation ? (
                simplifiedExplanation
              ) : (
                'Enter a concept to get a simplified explanation.'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Provide feedback to improve the explanation"
              className="w-full rounded-md shadow-sm"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
            <Button
              className="w-full mt-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed"
              onClick={handleExplanationImprovement}
              disabled={loading || !feedback}
            >
              Improve Explanation
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Home;
