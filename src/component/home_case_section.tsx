import {  Home_header_casesProps, CaseStudyProps } from "@/types/define_props";
import { UniversalCardCase } from "@/component/universalcardcase"


type Combine_data = Home_header_casesProps & CaseStudyProps;
export const HomeCaseSection = ({ Home_header_cases, case_data}: Combine_data) => {
  return (
    <>
      <div className="mb-10 md:mb-16 bg-white">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
           {Home_header_cases.title}
        </h2>

        <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
           {Home_header_cases.subtitle}

        </p>
        <UniversalCardCase case_data = {case_data} />
      </div>
    </>
  );
};
