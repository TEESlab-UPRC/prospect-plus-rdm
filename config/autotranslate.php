<?php

return [
    'source_language' => 'en',
    'target_languages' => [
        'deepl' => ['el', 'de', 'fr', 'it', 'pl', 'pt-PT', 'es', 'nl'],
        'google' => ['hr', 'cs', 'sk', 'sl', 'ga']
    ],
    'api_key' => env('AUTOTRANSLATE_DEEPL_KEY'),    // DeepL API key
    'api_key_g' => env('AUTOTRANSLATE_GOOGLE_KEY'), // Google Cloud Translation API key
    'options' => [                                  // See: https://github.com/DeepLcom/deepl-php & https://www.deepl.com/docs-api/translate-text
        'formality' => 'prefer_more',               // Choose the formality of the text. Available options: 'less', 'more', 'default', 'prefer_less', 'prefer_more'.
        'split_sentences' => 'nonewlines',          // Specify how input text should be split into sentences. Available options: 'on' (default), 'off', 'nonewlines'.
        'preserve_formatting' => false,             // Controls automatic-formatting-correction (punctuation at beginning/end, upper/lower case at beginning).
        'tag_handling' => 'html',                   // Type of tags to parse before translation. Available options: 'html', 'xml'.
        'glossary' => null,                         // The ID of the DeepL glossary to use. Default: null
    ],
    'language_options' => [],                       // Language-specific overrides. The key is the language code and the value is an array of options.
    'excluded_words' => [                           // Excluded strings.
        '\\n',
        '\\r',
        'Recommendation-Decision Matrix Tool',
        'Recommendation-Decision Matrix tool',
        'Recommendation-Decision Matrix',
        'Quick Finance Readiness Check',
        'TEESlab',
        'PROSPECT+',
        'HORIZON 2020',
        'Horizon 2020',
        'SEAPs',
        'SECAPs',
        'SECAP',
        'ESCOs',
        'EEOs',
        'Own Funds',
        'Interacting/Internal Contracting',
        'Revolving Funds',
        'Soft Loans',
        'Green Bonds',
        'EPC',
        '3rd Party Financing',
        'Guarantee Funds',
        'On-bill financing',
        'Citizens Financing - Cooperatives/Crowdfunding',
        'rdmtool.teeslab [at] unipi.gr',
        'CBP',
        'Google Analytics',
        'Google Cloud Translation',
        'DeepL',
        'API',
        'Email',
        'Cookies',
        'cookies',
        '(EU) 2016/679'
    ],
];
