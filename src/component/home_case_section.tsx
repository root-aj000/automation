import { Home_header_casesProps, CaseStudyProps } from "@/types/define_props";
import { UniversalCardCase } from "@/component/universalcardcase"

type Combine_data = Home_header_casesProps & CaseStudyProps;

export const HomeCaseSection = ({ Home_header_cases, case_data }: Combine_data) => {
  return (
    <section className="py-16 md:py-24 section-mesh">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Case Studies
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {Home_header_cases.title}
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            {Home_header_cases.subtitle}
          </p>
        </div>

        <UniversalCardCase case_data={case_data} />
      </div>
    </section>
  );
};
