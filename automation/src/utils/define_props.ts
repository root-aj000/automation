export interface Hero_1Props {
    Hero_1: {
        mh_line: string;
        tg_line: string;
        discription: string;
        p_cta: string;
        s_cta: string;
        image: string;
        alt: string;
    };
}

export interface Hero_2Props {
    Hero_2: {
        mh_line: string;
        tg_line: string;
        discription: string;
        p_cta: string;
        s_cta: string;
        image: string;
        alt: string;
    };
}

export interface Hero_3Props {
    Hero_3: {
        mh_line: string;
        tg_line: string;
        discription: string;
        p_cta: string;
        s_cta: string;
        image: string;
        alt: string;
    };
}

export interface Hero_4Props {
    Hero_4: {
        mh_line: string;
        tg_line: string;
        discription: string;
        p_cta: string;
        s_cta: string;
        image: string;
        alt: string;
    };
}

export interface logo_cloudProps {
    logo_cloud: {
        title: string;
        logos: string[];
    };
}

export interface HowItWorksProps {
    Howitworks: {
        title: string;
        subtitle: string;
        image: string;
        steps: {
            title: string;
            description: string;
            svg: string;
        }[];
    };
}

export interface ForWhomBlock {
    forwhom: {
        title: string;
        description: string;
        p_cta: string;
        items: {
            title: string;
            description: string;
            icon: string;
        };
    };
}

export interface list_headerProps {
    list_header: {
        title: string;
        discription: string;
    };
}


export interface FeatureGridProps {
    grid: {
        title: string;
        subtitle: string;
        features: {
            title: string;
            description: string;
            cta: string;
            link: string;
            icon: string;
        };
    };
}


export interface StatsProps {
    stats: {
        heading: string;
        description: string;
        items: {
            value: string;
            label: string;
        };
    };
}

export interface SubscribeFormProps {
    subscribe: {
        title: string;
        description: string;
        placeholder: string;
        buttonText: string;
    };
}

export interface BlogCardProps {
    title: string;
    author: string;
    contentType: string;
    serviceName: string;
    date: string;
    image: string;
    excerpt: string;
    tags: string[];
    category: string;
    href: string;
}

export interface BlogCard {
    blog_data: BlogCardProps;
    contentType: string;
    serviceName: string;
}

export interface caseCardProps {
    title: string;
    author: string;
    contentType: string;
    serviceName: string;
    date: string;
    image: string;
    excerpt: string;
    tags: string[];
    category: string;
    href: string;
}

export interface caseCard {
    case_data: caseCardProps;
}
export interface Home_header_blogProps {
    Home_header_blog: {
        title: string;
        subtitle: string;
    };
}

export interface Home_header_casesProps {
    Home_header_cases: {
        title: string;
        subtitle: string;
    };
}

export interface IndexProps {
    HomePage: {
        Hero_1: Hero_1Props["Hero_1"];
        logo_cloud: logo_cloudProps["logo_cloud"];
        Hero_2: Hero_2Props["Hero_2"];
        Hero_3: Hero_3Props["Hero_3"];
        Hero_4: Hero_4Props["Hero_4"];
        Howitworks: HowItWorksProps["Howitworks"];
        forwhom: ForWhomBlock["forwhom"];
        list_header: list_headerProps["list_header"];
        grid: FeatureGridProps["grid"];
        stats: StatsProps["stats"];
        subscribe: SubscribeFormProps["subscribe"];
        blog_data: BlogCardProps;
        Home_header_blog: Home_header_blogProps["Home_header_blog"];
        Home_header_cases: Home_header_casesProps["Home_header_cases"];
    };
}
