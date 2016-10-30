<my-doc>
  <div>doc.a = {doc.a}</div>

  <script>
    import {getDocObserverMixin} from './predicate-mixin.js'

    this.mixin(getDocObserverMixin(this))
    this.subscribe('collection', '0')
  </script>
</my-doc>

<app>
  <div each={items}>
    {a}
  </div>
  <button onclick={onclick}>start</button>
  <my-doc></my-doc>

  <script>
    import {getPredicateObserverMixin} from './predicate-mixin.js'

    this.mixin(getPredicateObserverMixin(this))
    this.subscribe('predicateA', {a: 5})

  </script>
</app>
