import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Using dummy data for now, replace with API later
        setTimeout(() => {
            setProducts([
                { id: 1, name: "Smartphone", price: 999, image: "https://via.placeholder.com/150" },
                { id: 2, name: "Laptop", price: 1299, image: "https://via.placeholder.com/150" },
                { id: 3, name: "Headphones", price: 199, image: "https://via.placeholder.com/150" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Arpico Online</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Product', { productId: item.id })}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.cardContent}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.price}>${item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Cart')}>
                    <Text style={styles.buttonText}>🛒 Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Checkout')}>
                    <Text style={styles.buttonText}>💳 Checkout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Product')}>
                    <Text style={styles.buttonText}>👤 Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#444",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007bff",
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    navButton: {
        flex: 1,
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;
