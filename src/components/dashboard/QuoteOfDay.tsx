import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Quote {
  content: string;
  author: string;
}

export default function QuoteOfDay() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch a random quote
    const fetchQuote = async () => {
      try {
        // Try to get quote from localStorage
        const savedQuote = localStorage.getItem('dailyQuote');
        const savedDate = localStorage.getItem('dailyQuoteDate');
        const today = new Date().toDateString();
        
        // If we have a quote saved for today, use it
        if (savedQuote && savedDate === today) {
          setQuote(JSON.parse(savedQuote));
          setLoading(false);
          return;
        }
        
        // Otherwise fetch a new quote
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        
        const newQuote = {
          content: data.content,
          author: data.author
        };
        
        setQuote(newQuote);
        
        // Save to localStorage with today's date
        localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
        localStorage.setItem('dailyQuoteDate', today);
      } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback quote
        setQuote({
          content: "The only way to do great work is to love what you do.",
          author: "Steve Jobs"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <Card className="h-[120px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Quote of the Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-10 animate-pulse bg-muted rounded"></div>
          <div className="h-4 w-1/3 mt-2 animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[120px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Quote of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm italic">"{quote?.content}"</p>
        <CardDescription className="text-right mt-1">— {quote?.author}</CardDescription>
      </CardContent>
    </Card>
  );
}
