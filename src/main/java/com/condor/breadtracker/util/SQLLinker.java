package com.condor.breadtracker.util;

import java.beans.PropertyVetoException;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.condor.breadtracker.recipe.Recipe;
import com.condor.breadtracker.starter.Starter;
import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * This class is used to handle interaction
 * between the Java backend and the PostgreSQL database.
 * It acts as a go-between so that we can interact
 * with database information in a Java friendly way.
 * 
 * It follows the singleton design pattern.
 */
@Configuration
@ComponentScan(basePackages = "com.condor.breadtracker")
@Component
public class SQLLinker implements DisposableBean {
    // Maintains, creates, and manages database connections
    private ComboPooledDataSource cpds = new ComboPooledDataSource();
    // Singleton object representation
    private static SQLLinker linker;

    // Create table SQL statements
    // TODO: Add constraints, break these out to another file, or play with another
    // method than PreparedStatements

    private static final String SQL_CREATE_RECIPE_TABLE = ""
            + "CREATE TABLE IF NOT EXISTS recipe_table ("
            + "id uuid,"
            + "name text,"
            + "description text,"
            + "timer_labels text[],"
            + "timer_lower_limits bigint[],"
            + "timer_upper_limits bigint[],"
            + "image text"
            + ")";

    private static final String SQL_CREATE_STARTER_TABLE = ""
            + "CREATE TABLE IF NOT EXISTS starter_table ("
            + "id uuid,"
            + "name text,"
            + "flourType text,"
            + "inFridge boolean,"
            + "timeLastFed bigint"
            + ")";

    /**
     * This method gets invoked when the Tomcat deploys
     * the WAR file. It handles SQLLinker startup by
     * creating an instance of the singleton, and
     * creating all tables if they do not exist.
     * 
     * @return The singleton
     */
    @Bean
    public SQLLinker start() {
        linker = new SQLLinker();
        linker.createAllTables();
        return linker;
    }

    /**
     * Singleton constructor. It initializes
     * the database connection pooler.
     */
    public SQLLinker() {
        try {
            cpds.setDriverClass("org.postgresql.Driver");
            cpds.setJdbcUrl("jdbc:postgresql://localhost:5432/breadtracker");
            cpds.setUser("postgres");
            cpds.setPassword("password1234");
            cpds.setUnreturnedConnectionTimeout(10000);
            cpds.setAcquireRetryAttempts(5);
            cpds.setAcquireRetryDelay(1000);
        } catch (PropertyVetoException e) {
            e.printStackTrace();
            // handle the exception
        }
    }

    /**
     * Creates all tables
     */
    public void createAllTables() {
        this.createRecipeTable();
        this.createStarterTable();
    }

    public void createRecipeTable() {
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement(SQL_CREATE_RECIPE_TABLE);
            st.execute();
            st.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void createStarterTable() {
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement(SQL_CREATE_STARTER_TABLE);
            st.execute();
            st.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Recipe getRecipe(UUID uuid) {
        Recipe recipe = null;
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("select * from recipe_table where id::text = ?");
            st.setString(1, uuid.toString());
            ResultSet r1 = st.executeQuery();
            if (r1.next()) {
                recipe = new Recipe(UUID.fromString(r1.getString("uuid")),
                        r1.getString("name"),
                        r1.getString("description"),
                        r1.getArray("timer_labels"),
                        r1.getArray("timer_upper_limits"),
                        r1.getArray("timer_lower_limits"),
                        r1.getString("image"));
            }
            st.close();
            r1.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return recipe;
    }

    public ArrayList<Recipe> getRecipes() {
        ArrayList<Recipe> recipes = new ArrayList<>();
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("select * from recipe_table;");
            ResultSet r1 = st.executeQuery();
            while (r1.next()) {
                recipes.add(new Recipe(UUID.fromString(r1.getString("id")),
                        r1.getString("name"),
                        r1.getString("description"),
                        r1.getArray("timer_labels"),
                        r1.getArray("timer_lower_limits"),
                        r1.getArray("timer_upper_limits"),
                        r1.getString("image")));
            }
            st.close();
            r1.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return recipes;
    }

    public boolean addRecipe(Recipe recipe) {
        boolean success = false;
        if (recipe == null) {
            return false;
        }
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement(
                    "INSERT INTO recipe_table(id, name, description, timer_labels, timer_lower_limits, timer_upper_limits, image) VALUES (?, ?, ?, ?, ?, ?, ?);");
            st.setObject(1, recipe.getUuid());
            st.setString(2, recipe.getName());
            st.setString(3, recipe.getDescription());
            HashMap<String, Object[]> timersMap = recipe.getTimersMap();
            st.setArray(4, conn.createArrayOf("text", timersMap.get("labels")));
            st.setArray(5, conn.createArrayOf("BIGINT", timersMap.get("lower_limits")));
            st.setArray(6, conn.createArrayOf("BIGINT", timersMap.get("upper_limits")));
            st.setString(7, recipe.getImage());
            int numInserted = st.executeUpdate();
            st.close();
            conn.close();
            return (numInserted == 1);
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return success;
    }

    public boolean deleteRecipe(UUID uuid) {
        boolean success = false;
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("DELETE FROM recipe_table WHERE id=?;");
            st.setObject(1, uuid);
            int numDeleted = st.executeUpdate();
            st.close();
            conn.close();
            return (numDeleted == 1);
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return success;
    }

    /**
     * Called by the Tomcat when the WAR file
     * is being undeployed. This performs
     * cleanup on the database connections.
     */
    @Override
    public void destroy() throws Exception {
        if (this.cpds != null) {
            this.cpds.close();
        }
    }

    public static SQLLinker getInstance() {
        return linker;
    }

    public ArrayList<Starter> getStarters() {
        ArrayList<Starter> starters = new ArrayList<>();
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("select * from starter_table;");
            ResultSet r1 = st.executeQuery();
            while (r1.next()) {
                starters.add(new Starter(
                        UUID.fromString(r1.getString("id")),
                        r1.getString("name"),
                        r1.getString("flourType"),
                        r1.getBoolean("inFridge"),
                        r1.getLong("timeLastFed")));
            }
            st.close();
            r1.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return starters;
    }

    public boolean addStarter(Starter starter) {
        boolean success = false;
        if (starter == null) {
            return false;
        }
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement(
                    "INSERT INTO starter_table(id, name, flourType, inFridge, timeLastFed) VALUES (?, ?, ?, ?, ?);");
            st.setObject(1, starter.getUuid());
            st.setString(2, starter.getName());
            st.setString(3, starter.getFlourType());
            st.setBoolean(4, starter.isInFridge());
            st.setLong(5, starter.getTimeLastFed());
            int numInserted = st.executeUpdate();
            st.close();
            conn.close();
            return (numInserted == 1);
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return success;
    }

    public boolean deleteStarter(UUID uuid) {
        boolean success = false;
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("DELETE FROM starter_table WHERE id=?;");
            st.setObject(1, uuid);
            int numDeleted = st.executeUpdate();
            st.close();
            conn.close();
            return (numDeleted == 1);
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return success;
    }

    public Starter getStarter(UUID uuid) {
        Starter starter = null;
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("select * from starter_table where id::text = ?");
            st.setString(1, uuid.toString());
            ResultSet r1 = st.executeQuery();
            if (r1.next()) {
                starter = new Starter(
                    UUID.fromString(r1.getString("id")),
                    r1.getString("name"),
                    r1.getString("flourType"),
                    r1.getBoolean("inFridge"),
                    r1.getLong("timeLastFed")
                );
            }
            st.close();
            r1.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return starter;
    }

    public boolean updateStarter(Starter starter) {
        boolean success = false;
        try {
            Connection conn = cpds.getConnection();
            PreparedStatement st = conn.prepareStatement("UPDATE starter_table SET name=? flourType=? inFridge=? timeLastFed=? WHERE id=?");
            st.setString(1, starter.getName());
            st.setString(2, starter.getFlourType());
            st.setBoolean(3, starter.isInFridge());
            st.setLong(4, starter.getTimeLastFed());
            st.setString(5, starter.getUuid().toString());
            success = (st.executeUpdate() == 1);
            st.close();
            conn.close();
        } catch (SQLException e) {
            System.out.println("SQL Exception: " + e.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return success;
    }
}
