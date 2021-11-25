import Main from '../index';
import AutoItems from './auto';
import CustomItems from './custom';

class Items {
    auto: AutoItems;
    custom: CustomItems;

    constructor(main: Main) {
        this.auto = new AutoItems(main);
        this.custom = new CustomItems(main);
    }
}

export default Items;
