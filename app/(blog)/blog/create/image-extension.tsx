import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "w-full h-[450px] object-cover rounded-md",
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return {
            class: attributes.class,
          };
        },
      },
      style: {
        default: "height: 450px; width: 100%; object-fit: cover;",
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});
