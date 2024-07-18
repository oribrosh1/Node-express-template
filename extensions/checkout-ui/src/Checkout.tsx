import {
  reactExtension,
  Banner,
  Checkbox,
  Button,
  View,
  useCustomer,
  useCartLines,
  useTranslate,
  Spinner,
  ProductThumbnail,
  InlineStack,
  ScrollView,
  Pressable,
  Text,
  useApi
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension('purchase.checkout.header.render-after', () => (
  <Extension />
));

function Extension() {
  const { id: customerId } = useCustomer();
  const { extension } = useApi();

  const translate = useTranslate();
  const cartLines = useCartLines();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCartItems(cartLines.map(line => ({
      title: line.merchandise?.title ?? '',
      quantity: line.quantity,
      checked: false, //All checkboxes should be unchecked by default.
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

  const saveCart = async () => {
    setIsSaving(true);
    const itemsToSave = cartItems.filter(item => item.checked);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const APP_URL = `${(new URL(extension.scriptUrl)).origin}/cart`;
    try {
      const response = await fetch(APP_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          itemsToSave,
          customerId
        }),
      });

      if (!response.ok) {
        setError(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setSuccess(true);

    } catch (error) {
      setError(`Failed to save cart: ${error}`);
      console.error(`Failed to save cart: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View padding={'tight'} >
      <Banner status='info'>
        <View padding={'tight'}  >
          <Text appearance='info' size='medium'>{translate("bannertext")}</Text>
          {isSaving ? (
            <Spinner accessibilityLabel='Saving cart' />
          ) : (
            <>
              <ScrollView maxBlockSize={240} padding={'base'}>
                {cartItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleCheckboxChange(item)}
                  >
                    <InlineStack padding={'base'} blockAlignment='center' >
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
        </View>
      </Banner>
      {success &&
        <Banner onDismiss={() => setSuccess(false)} collapsible={true} status='success'>
          <Text>{translate("successtext")}</Text>
        </Banner>
      }
      {error !== '' &&
        <Banner onDismiss={() => setError('')} collapsible={true} status='critical'>
          <Text>{error}</Text>
        </Banner>
      }
    </View>
  );
}
