<script>
import Store from './store.js'

  const dropStores = async () => {

      const res = await fetch(`http://localhost:5002/dropstore`, {
          method: 'DELETE',
        });

      Store.update(async (_cards) => {
            console.log("Fetching new")
            let res = await fetch('http://localhost:5002/cards');
            let data = await res.json();
            return data
        })

}

</script>

<div>
    <form on:submit={dropStores}>
      <div class="form-group">
        <h3>Drop All Data Stores</h3>
      </div>
      <button class="btn btn-danger">Drop</button>
    </form>
  </div>