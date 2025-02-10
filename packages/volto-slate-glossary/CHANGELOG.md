# Changelog

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/volto/developer-guidelines/contributing.html#create-a-pull-request
-->

<!-- towncrier release notes start -->

## 2.2.0 (2025-02-10)

### Feature

- Optionally show tooltips in accordion block panel. Default is false. @ksuess
  Prepare for tooltips in description block. Add intructions to README. @ksuess
  Prepare for tooltips in teaser block. Add intructions to README. @ksuess
  Make TooltipPopup customizable via component registry. @ksuess [#13](https://github.com/rohberg/volto-slate-glossary/issue/13)

## 2.1.0 (2024-10-25)

### Feature

- Show an alphabet navigation on glossary. Clicking a letter scrolls the entries for this letter into view. @mauritsvanrees, @ksuess [#11](https://github.com/rohberg/volto-slate-glossary/issue/11)
- Add option to mention the term in the header of its tooltip. @mauritsvanrees, @ksuess [#12](https://github.com/rohberg/volto-slate-glossary/issue/12)

## 2.0.1 (2024-10-25)

## 2.0.0 (2024-10-25)

### Feature

- New option 'show tooltips only on first occurrences on a page' @ksuess [#5](https://github.com/ksuess/volto-slate-glossary/issue/5)

### Internal

- Refactor package to cookieplone template. @ksuess

  Add backend with collective.glossary. @ksuess

  New concept: Instead of generating the tooltip enhanced markup in each Slate leaf,
  we generate all tooltip enhanced leaf texts on route change, store them with jotai atom and use the appropriate ones in the leafs. @ksuess [#10](https://github.com/ksuess/volto-slate-glossary/issue/10)
