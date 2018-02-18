<?php
declare(strict_types=1);

namespace Acelaya\SpressPlugin\AcelayaSpressTwig\Filter;

class ExternalLinks
{
    const NAME = 'external_links';

    public function __invoke($html)
    {
        return $html;
    }
}
