import {UImixin} from './uiActor.js'
<my-doc>
    <div>doc.a = {doc.a}</div>
    <button onclick={click}>click</button>
    <div>listo: {ready}</div>

    <script>
      this.ready = true
      this.mixin(UImixin(this))
      this.subscribeDoc('collection', '0')
      this.click = (e) => {
        this.ready = false
        console.log(this.aa)
        this.aa.rpc('insert', {id:'0', a: 700}).then((data)=>{
            this.ready = true
            this.update()
        })
      }
    </script>
</my-doc>

<app>
  <div each={items}>
    {a}
  </div>
  <my-doc></my-doc>

  <script>
    this.mixin(UImixin(this))
    this.subscribePredicate('predicateA', {a: 5})

    this.sortCmp = (a,b) => 1

  </script>
</app>
