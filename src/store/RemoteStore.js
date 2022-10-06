export class RemoteStore {

  constructor(url) {
    this.url = url;
  }

  getNode = id => {

  }

  getConnectedNodes = id => {

  }

  getAllLocatedNodes = () =>
    fetch(`${this.url}/Places`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });

  searchMappable = query => {
    console.warn('Text queries not supported yet');
    return this.getAllLocatedNodes();
  }

}