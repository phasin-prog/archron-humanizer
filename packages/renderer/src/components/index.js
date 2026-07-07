import Text from "./inline/text";
import Bold from "./inline/bold";
import Italic from "./inline/italic";
import Strikethrough from "./inline/strikethrough";
import CodeInline from "./inline/code-inline";
import Heading from "./block/heading";
import Paragraph from "./block/paragraph";
import Blockquote from "./block/blockquote";
import CodeBlock from "./block/code-block";
import HorizontalRule from "./block/horizontal-rule";
import List from "./block/list";
import ListItem from "./block/list-item";
import Table from "./block/table";
import TableRow from "./block/table-row";
import TableCell from "./block/table-cell";
import Link from "./rich/link";
import Image from "./rich/image";
import WikiLink from "./rich/wiki-link";
import Callout from "./rich/callout";
import Footnote from "./rich/footnote";
import Root from "./structural/root";
import Embed from "./structural/embed";
export const DEFAULT_COMPONENTS = {
    root: Root,
    heading: Heading,
    paragraph: Paragraph,
    text: Text,
    bold: Bold,
    italic: Italic,
    strikethrough: Strikethrough,
    code_inline: CodeInline,
    code_block: CodeBlock,
    blockquote: Blockquote,
    list: List,
    list_item: ListItem,
    link: Link,
    image: Image,
    horizontal_rule: HorizontalRule,
    table: Table,
    table_row: TableRow,
    table_cell: TableCell,
    wiki_link: WikiLink,
    callout: Callout,
    footnote: Footnote,
    embed: Embed,
};
