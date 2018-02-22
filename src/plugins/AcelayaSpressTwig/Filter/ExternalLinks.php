<?php
declare(strict_types=1);

namespace Acelaya\SpressPlugin\AcelayaSpressTwig\Filter;

class ExternalLinks
{
    public const NAME = 'external_links';

    /**
     * @var string|null
     */
    private $siteUrl;

    public function __construct(?string $siteUrl)
    {
        $this->siteUrl = $siteUrl;
    }

    public function __invoke($html)
    {
        $doc = new \DOMDocument();
        $doc->loadHTML($html);

        /** @var \DOMElement[] $links */
        $links = $doc->getElementsByTagName('a');
        foreach ($links as $link) {
            // If the link is not external or already has a "target" attribute, ignore it
            if ($this->linkHasTargetBlank($link) || $this->linkIsInternal($link)) {
                continue;
            }

            $link->setAttribute('target', '_blank');
        }

        return $doc->saveHTML();
    }

    private function linkHasTargetBlank(\DOMElement $link): bool
    {
        return $link->hasAttribute('target') && $link->getAttribute('target') === '_blank';
    }

    private function linkIsInternal(\DOMElement $link): bool
    {
        if (! $link->hasAttribute('href')) {
            return true;
        }
        $href = $link->getAttribute('href');

        // If the site URL has been set, we consider the link internal if it begins by that site URL or by #
        if (! empty($this->siteUrl)) {
            return \strpos($href, $this->siteUrl) !== false || \strpos($href, '#') === 0;
        }

        // In other cases, we consider the link internal if it does not begin with http
        return \strpos($href, 'http') !== 0;
    }
}
