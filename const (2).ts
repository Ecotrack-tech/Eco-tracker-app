/**
 * NOT FOUND PAGE — Biophilic Minimalism
 */
import { Link } from 'wouter';
import { Leaf, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-24">
      <div className="text-center animate-fade-up">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'oklch(0.93 0.04 148)' }}
        >
          <Leaf size={36} className="text-primary" />
        </div>
        <h1 className="font-['Fraunces'] font-black text-5xl text-primary mb-2">404</h1>
        <p className="font-['Fraunces'] font-bold text-xl text-foreground mb-2">
          Page not found
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          This path doesn't exist in our green journey.
        </p>
        <Link href="/">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors mx-auto">
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
