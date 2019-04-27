<?php
declare(strict_types=1);

namespace Acelaya\SpressPlugin\AcelayaSpressTwig\Func;

use function array_unique;

class Taxonomies
{
    public const NAME = 'taxonomies';

    public function __invoke(array $elements, string $type): array
    {
        $result = [];

        foreach ($elements as $posts) {
            foreach ($posts as $post) {
                foreach ($post[$type] as $element) {
                    $result[] = $element;
                }
            }
        }

        // Remove duplicates and sort
        $result = array_unique($result);
        sort($result);

        return $result;
    }
}
