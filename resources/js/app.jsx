import './bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { getCSSVar } from './Helpers/DomHelpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup: ({ el, App, props }) => createRoot(el).render(<App {...props} />),
    progress: {
        color: getCSSVar("pp-cyan"),
    },
});
