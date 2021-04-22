defmodule Inmana.Welcomer do
  def welcome(%{"name" => name, "age" => age}) do
    age = String.to_integer(age)

    name
    |> String.trim()
    |> String.downcase()
    |> evaluate(age)
  end

  def evaluate("banana", 42) do
    {:ok, "You are very special, banana!"}
  end

  def evaluate(name, age) when age >= 18 do
    {:ok, "Welcome, #{name}!"}
  end

  def evaluate(name, _age) do
    {:error, "You shall not pass, #{name}!"}
  end

end
