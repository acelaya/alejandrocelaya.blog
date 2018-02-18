<?php
// Important!! This class cannot have a namespace

use Acelaya\SpressPlugin\AcelayaSpressTwig\Filter;
use Acelaya\SpressPlugin\AcelayaSpressTwig\Func;
use Yosymfony\Spress\Core\ContentManager\Renderizer\TwigRenderizer;
use Yosymfony\Spress\Core\Plugin\Event\EnvironmentEvent;
use Yosymfony\Spress\Core\Plugin\EventSubscriber;
use Yosymfony\Spress\Core\Plugin\PluginInterface;

class AcelayaSpressTwig implements PluginInterface
{
    private $io;

    public function initialize(EventSubscriber $subscriber)
    {
        $subscriber->addEventListener('spress.start', 'onStart');
    }

    public function getMetas()
    {
        return [
            'name' => 'acelaya/spress-twig',
            'description' => 'Provides twig extensions for spress blog',
            'author' => 'Alejandro Celaya',
            'license' => 'MIT',
        ];
    }
    
    public function onStart(EnvironmentEvent $event)
    {
        $this->io = $event->getIO();

        /** @var TwigRenderizer $renderizer */
        $renderizer = $event->getRenderizer();
        $renderizer->addTwigFunction(Func\Lunr::NAME, new Func\Lunr(), ['is_safe' => ['html']]);
        $renderizer->addTwigFilter(Filter\TruncateHtml::NAME, new Filter\TruncateHtml(), ['is_safe' => ['html']]);
        $renderizer->addTwigFilter(Filter\ExternalLinks::NAME, new Filter\ExternalLinks(
            $event->getConfigValues()['url'] ?? null
        ), ['is_safe' => ['html']]);
        $renderizer->addTwigFunction('dump', function () {
            $values = \func_get_args();
            \var_dump(...$values);
        }, ['is_safe' => ['html']]);
    }
}
