# Implementation Plan - Copywriting Playbook Upgrade

# Goal Description
Upgrade the skeletal MDX templates in `u:\automation\template\playbook` into comprehensive "Senior Copywriter" playbooks.
These playbooks will provide actionable guidance, frameworks, and reference checks for writing high-converting copy, modeled after [u:\automation\template\example\ex01.mdx](file:///u:/automation/template/example/ex01.mdx).

The goal is to ensure "anyone who even dont know what is copywriting can write a best copy" by following these guides.

## User Review Required
> [!IMPORTANT]
> **Content Strategy**: I will be defining specific frameworks for each template type (e.g., STAR for Case Studies, FAB for Features). Please review the mapped frameworks in the "Proposed Changes" section to ensure they align with your preference.

## Proposed Changes

I will update **all** files in `u:\automation\template\playbook`. Each file will be expanded to include:
1.  **General Principles**: High-level rules for that specific content type.
2.  **Section-by-Section Guide**:
    *   **Purpose**: Why this section exists.
    *   **Framework**: Specific framework to use (e.g., AIDA, PAS).
    *   **Reference Check**: Explicitly mapping which questions from [reference/03.mdx](file:///u:/automation/template/reference/03.mdx) this section answers.
    *   **What to Write**: Concrete instructions.
    *   **Dos & Don'ts**: Checklist for quality.
3.  **Psychological Flow**: A summary table mapping the flow to user questions.

### Playbook Templates

#### [MODIFY] [homepage-template.mdx](file:///u:/automation/template/playbook/homepage-template.mdx)
-   **Current**: Skeletal frontmatter + basic structure.
-   **New Content**: Full playbook based on [ex01.mdx](file:///u:/automation/template/example/ex01.mdx) but refined to strictly follow the [reference/03.mdx](file:///u:/automation/template/reference/03.mdx) Q&A mapping.
-   **Frameworks**: AIDA, PAS, FAB, Authority-Building.

#### [MODIFY] [case-study-template.mdx](file:///u:/automation/template/playbook/case-study-template.mdx)
-   **Focus**: Proof and Transformation.
-   **Frameworks**: 
    -   **STAR** (Situation, Task, Action, Result) or **BAB** (Before, After, Bridge).
-   **Reference Focus**: "Can I trust you?", "Do real people use this?", "What results will I see?".

#### [MODIFY] [use-case-template.mdx](file:///u:/automation/template/playbook/use-case-template.mdx)
-   **Focus**: Industry/Scenario specific application.
-   **Frameworks**: 
    -   **PAS** (Problem in that industry, Agitate pain, Solution with your tool).
-   **Reference Focus**: "Does this apply to me?", "What exact problem do you solve?".

#### [MODIFY] [feature-template.mdx](file:///u:/automation/template/playbook/feature-template.mdx)
-   **Focus**: Deep dive into a specific capability.
-   **Frameworks**: 
    -   **FAB** (Feature, Advantage, Benefit).
-   **Reference Focus**: "How does it work?", "Is it hard to use?", "Why is this better?".

#### [MODIFY] [feature-grid-template.mdx](file:///u:/automation/template/playbook/feature-grid-template.mdx)
-   **Focus**: Overview of capabilities (Comparison or List).
-   **Frameworks**: 
    -   **Scan-ability & Benefit-Stacking**.
-   **Reference Focus**: "What do you do?", "Value & Differentiation".

#### [MODIFY] [blog-template.mdx](file:///u:/automation/template/playbook/blog-template.mdx)
-   **Focus**: SEO & Education.
-   **Frameworks**: 
    -   **APP** (Agree, Promise, Preview) for intro.
    -   **H2/H3 Structure** for readability.
-   **Reference Focus**: "Who are you (Authority)?", "Why should I care?".

## Verification Plan

### Manual Verification
1.  **Content Check**: I will manually verify that each new template contains:
    -   [ ] A mapping to [reference/03.mdx](file:///u:/automation/template/reference/03.mdx) questions.
    -   [ ] Explicit "What to add" / "What not to add" (Dos/Don'ts).
    -   [ ] Designated Frameworks.
2.  **Cross-Reference**: Compare [homepage-template.mdx](file:///u:/automation/template/homepage-template.mdx) content against [example/ex01.mdx](file:///u:/automation/template/example/ex01.mdx) to ensure quality parity.
