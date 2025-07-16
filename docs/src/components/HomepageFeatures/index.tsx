import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Src: string;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'High Performance Logging',
        Src: require('@site/static/img/performance-logging.png').default,
        description: (
            <>
                Built on Pino's ultra-fast JSON logging foundation. Delivers minimal overhead and maximum throughput for
                production applications with extensive database operations.
            </>
        ),
    },
    {
        title: 'Seamless TypeORM Integration',
        Src: require('@site/static/img/typeorm-integration.png').default,
        description: (
            <>
                Drop-in replacement for TypeORM's default logger. Automatically captures query execution times,
                parameters, and errors with zero configuration changes to your existing TypeORM setup.
            </>
        ),
    },
    {
        title: 'Structured Logging & Observability',
        Src: require('@site/static/img/structured-logging.png').default,
        description: (
            <>
                JSON-structured output with configurable log levels, slow query detection, and rich contextual metadata.
                Perfect for modern observability stacks and log aggregation systems.
            </>
        ),
    },
];

function Feature({ title, Src, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <img src={Src} className={styles.featureSvg} alt={title} />
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
