export function PlaceholderSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-32 bg-card/40 border border-muted/40 rounded-2xl flex items-center justify-center">
            <div className="text-muted-foreground">
              <div className="text-lg font-medium mb-2">
                More Content Coming Soon
              </div>
              <div className="text-sm">
                This space is reserved for FAQs and student testimonials
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}