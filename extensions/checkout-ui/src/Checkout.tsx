import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Button,
  View,
  useShop,
  useCustomer,
  useCartLines,
  useTranslate,
  Spinner,
  ProductThumbnail,
  InlineStack,
  ScrollView,
  Pressable,
  Text,
  useApplyCartLinesChange
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension('purchase.checkout.header.render-after', () => (
  <Extension />
));

function Extension() {
  const { name: shop } = useShop();
  const { id: userId } = useCustomer();
  const translate = useTranslate();
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);



  useEffect(() => {
    setCartItems(cartLines.map(line => ({
      title: line.merchandise?.title ?? '',
      quantity: line.quantity,
      checked: true,
      id: line.merchandise?.id ?? '',
      imageSrc: line?.merchandise?.image?.url ?? ''
    })));
  }, []);

  const handleCheckboxChange = (changedItem) => {
    setCartItems(items =>
      items.map(item =>
        item.id === changedItem.id ? { ...item, checked: !changedItem.checked } : item
      )
    );
  };
  const updateCartLines = async (itemsToSave) => {
    for (const itemToSave of itemsToSave) {
      const change = {
        type: 'updateCartLine' as const,
        id: itemToSave.id,
        quantity: itemToSave.quantity,
      };
      await applyCartLinesChange(change);
    }
  };
  const saveCart = async () => {
    setIsSaving(true);
    const itemsToSave = cartItems.filter(item => item.checked);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const APP_URL = `${process?.env?.APP_URL ?? 'https://mouth-dispatch-stupid-cartoon.trycloudflare.com'}/cartsession`;

    try {
      const response = await fetch(APP_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          shop,
          isOnline: true,
          state: itemsToSave,
          userId
        }),
      });

      if (!response.ok) {
        setError(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      updateCartLines(itemsToSave); // Use the state returned from the server to update cart lines

    } catch (error) {
      setError(`Failed to save cart: ${error}`);
      console.error(`Failed to save cart: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BlockStack padding={'tight'} maxBlockSize={400}>
      <BlockStack padding={'tight'} maxBlockSize={400}>
        {error !== '' && <Banner onDismiss={() => setError('')} collapsible={true} status='critical'>
          <Text>{error}</Text>
        </Banner>}
      </BlockStack>

      <Banner status='info'>
        <Text appearance='info' size='medium'>{translate("bannertext")}</Text>
        {isSaving ? (
          <Spinner accessibilityLabel='Saving cart' />
        ) : (
          <>
            <ScrollView maxBlockSize={235} padding={'base'}>
              {cartItems.map((item) => (
                <Pressable
                  onPress={() => handleCheckboxChange(item)}
                > <InlineStack padding={'base'} blockAlignment='center' key={item.id}>
                    <View padding='base'>
                      <Checkbox checked={item.checked} />
                    </View>
                    <ProductThumbnail
                      source={item.imageSrc}
                      alt={`Image of ${item.title}`}
                      badge={item.quantity}
                      size='base'
                    />
                    <View padding='base'>{item.title}</View>
                  </InlineStack>
                </Pressable>
              ))}
            </ScrollView>
            <Button onPress={saveCart} disabled={isSaving}>
              {translate("savebtn")}
            </Button>
          </>
        )}
      </Banner>
    </BlockStack>
  );
}
