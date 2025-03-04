const scanBarcode = async (imageSrc) => {
    try {
      const img = document.createElement("img");
      img.src = imageSrc;
      await img.decode();
  
      const codeReader = new BrowserMultiFormatReader();
      const result = await codeReader.decodeFromImageElement(img);
  
      if (result) {
        setBarcode(result.getText());
        await fetchProduct(result.getText()); // Add await here
      } else {
        manualInputPrompt();
        setImage(null);
      }
    } catch (error) {
      console.error("Barcode scan failed:", error);
      manualInputPrompt();
    }
  };
  