// @ts-check
/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
const typedocSidebar = {
    items: [
        {
            type: 'category',
            label: 'Classes',
            items: [
                {
                    type: 'doc',
                    id: 'api/classes/TypeOrmPinoLogger',
                    label: 'TypeOrmPinoLogger',
                },
            ],
        },
        {
            type: 'category',
            label: 'Interfaces',
            items: [
                {
                    type: 'doc',
                    id: 'api/interfaces/TypeOrmPinoLoggerOptions',
                    label: 'TypeOrmPinoLoggerOptions',
                },
            ],
        },
    ],
};
module.exports = typedocSidebar.items;
