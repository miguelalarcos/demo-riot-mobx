<app>
  <div each={items}>
    {a}
  </div>
  <button onclick={onclick}>start</button>

  <script>
    // import {newCollection} from './core.js'
    import {getPredicateObserverMixin} from './predicate-mixin.js'

    // newCollection('collection')
    // P.register('predicateA', 'collection')

    this.mixin(getPredicateObserverMixin(this))
    this.subscribe('predicateA', {a: 5})
    // this.insert('collection', {a: 0})

  </script>
</app>
