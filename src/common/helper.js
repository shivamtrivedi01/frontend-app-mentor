import ColorGenerator from "color-generator";
import moment from 'moment';

export const generateColor = () => {
    const generator = new ColorGenerator(0.3, .9);
    return generator.rgbString()
};
export const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
}
