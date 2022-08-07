const sanitizeHtml = require('sanitize-html');

const html = "<strong>hello world</strong>";
const dirty = 'some really tacky HTML';


// console.log(sanitizeHtml(html));
// console.log(clean);

const validate=(value, helpers)=>{
    const clean = sanitizeHTML(value, {
        allowedTags: [],
        allowedAttributes: {},
    });
    if (clean !== value) return helpers.error('string.escapeHTML', { value })
    return clean;
}

validate(html,helpers);
